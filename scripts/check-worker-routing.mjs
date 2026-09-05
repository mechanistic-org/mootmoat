import assert from "node:assert/strict";
import {readdir} from "node:fs/promises";
const file = (await readdir(new URL("../dist/_worker.js/",import.meta.url))).find((name) => /^manifest_.*\.mjs$/.test(name));
const {manifest} = await import(new URL(`../dist/_worker.js/${file}`,import.meta.url));
const entry = manifest.routes.find((entry) => entry.routeData.route === "/assets/[...path]");
assert.ok(entry,"Generated production manifest includes the R2 route");
console.log(JSON.stringify({route:entry.routeData.route,pattern:entry.routeData.pattern.toString()}));
assert.ok(entry.routeData.pattern.test("/assets/mootmoat_v18.png"),"The actual generated R2 route must match the exact metadata filename URL");
