import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const root = fileURLToPath(new URL("../", import.meta.url));
const mark = await readFile(path.join(root, "docs/brand/mark.svg"));
const favicons = path.join(root, "public/favicons");
await mkdir(favicons, { recursive: true });
for (const target of ["src/assets/images/logo.svg", "public/logo.svg", "public/images/logo.svg", "public/favicons/favicon.svg"]) {
  await writeFile(path.join(root, target), mark);
}
for (const [name, size] of [["favicon-96x96.png", 96], ["apple-touch-icon.png", 180], ["web-app-manifest-192x192.png", 192], ["web-app-manifest-512x512.png", 512]]) {
  await sharp(mark).resize(size, size).png().toFile(path.join(favicons, name));
}
// A single PNG-compressed 32px ICO entry, with the standard ICONDIR header.
const png = await sharp(mark).resize(32, 32).png().toBuffer();
const ico = Buffer.alloc(22);
ico.writeUInt16LE(1, 2);
ico.writeUInt16LE(1, 4);
ico[6] = ico[7] = 32;
ico.writeUInt16LE(1, 10);
ico.writeUInt16LE(32, 12);
ico.writeUInt32LE(png.length, 14);
ico.writeUInt32LE(22, 18);
await writeFile(path.join(favicons, "favicon.ico"), Buffer.concat([ico, png]));
await mkdir(path.join(root, "docs/release-assets"), { recursive: true });
await sharp(path.join(root, "docs/brand/social.svg")).png().toFile(path.join(root, "docs/release-assets/mootmoat_v18.png"));
console.log("Brand assets generated locally; no R2 upload or deployment performed.");
