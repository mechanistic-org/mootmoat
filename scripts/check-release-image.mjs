import assert from "node:assert/strict";
import {createHash} from "node:crypto";
const base = process.argv[2] || "https://mootmoat.com";
const response = await fetch(base + "/assets/mootmoat_v18.png", {redirect:"manual",signal:AbortSignal.timeout(15000)});
const actual = {status:response.status, type:response.headers.get("content-type"),location:response.headers.get("location")};
console.log(JSON.stringify(actual));
assert.equal(actual.status,200,"The exact metadata URL must serve R2 bytes directly");
assert.equal(actual.type,"image/png");
assert.equal(createHash("sha256").update(Buffer.from(await response.arrayBuffer())).digest("hex"),"39b53aa046fdf390d45aa8d6b5f8ea5de62033f3b1a11a0d01ae79d6340b45f7");
