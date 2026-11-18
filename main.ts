import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

function jpegDimensions(bytes: Buffer): { width: number; height: number } {
  let cursor = 2;
  while (cursor < bytes.length) {
    if (bytes[cursor] !== 0xff) {
      throw new Error("Malformed JPEG: expected a segment marker.");
    }
    while (cursor < bytes.length && bytes[cursor] === 0xff) cursor++;
    if (cursor === bytes.length) break;

    const marker = bytes[cursor++];
    if (marker === 0xda || marker === 0xd9) break;
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    if (marker === 0x00 || marker === 0xd8 || cursor + 2 > bytes.length) {
      throw new Error("Malformed or truncated JPEG segment.");
    }

    const segmentLength = bytes.readUInt16BE(cursor);
    if (segmentLength < 2 || cursor + segmentLength > bytes.length) {
      throw new Error("Invalid JPEG segment length.");
    }

    // Frame markers carry dimensions; these three markers carry other data.
    const isFrame =
      marker >= 0xc0 && marker <= 0xcf &&
      marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isFrame) {
      if (segmentLength < 8) {
        throw new Error("The JPEG frame is too short to contain dimensions.");
      }
      return {
        width: bytes.readUInt16BE(cursor + 5),
        height: bytes.readUInt16BE(cursor + 3),
      };
    }
    cursor += segmentLength;
  }
  throw new Error("No readable JPEG frame dimensions were found.");
}

const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(scriptDirectory, "entry.png");
const outputDirectory = resolve(process.env.MAKEFUN_OUTPUT_DIR || "/output");
const outputPath = join(outputDirectory, "entry.png");
const sourceBytes = readFileSync(sourcePath);

mkdirSync(outputDirectory, { recursive: true });
copyFileSync(sourcePath, outputPath);
const outputBytes = readFileSync(outputPath);

if (outputBytes.length !== sourceBytes.length || !outputBytes.equals(sourceBytes)) {
  throw new Error("The output differs from the approved source image.");
}
if (outputBytes.length === 0 || outputBytes.length >= 1024 * 1024) {
  throw new Error("The output must be nonempty and smaller than 1 MiB.");
}
if (
  outputBytes.length < 4 ||
  outputBytes[0] !== 0xff ||
  outputBytes[1] !== 0xd8 ||
  outputBytes.at(-2) !== 0xff ||
  outputBytes.at(-1) !== 0xd9
) {
  throw new Error("The output must be a JPEG image.");
}

const { width, height } = jpegDimensions(outputBytes);
if (width < 1 || height < 1 || width > 1024 || height > 1024) {
  throw new Error(`JPEG dimensions must be at most 1024x1024; got ${width}x${height}.`);
}

console.log(
  `Wrote ${outputPath} (${outputBytes.length} bytes, JPEG ${width}x${height}; verified byte-identical).`,
);
