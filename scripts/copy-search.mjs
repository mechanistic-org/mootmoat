import { cp, access } from "node:fs/promises";

await access(new URL("../dist/pagefind/pagefind.js", import.meta.url));
await cp(new URL("../dist/pagefind/", import.meta.url), new URL("../public/pagefind/", import.meta.url), { recursive: true });
console.log("Copied the current build's Pagefind index for local development.");
