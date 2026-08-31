import { spawnSync } from "node:child_process";

const npmCli = process.env.npm_execpath;

if (!npmCli) {
  throw new Error("Run this build through `npm run build:worker`.");
}

const result = spawnSync(process.execPath, [npmCli, "run", "build"], {
  env: { ...process.env, CF_PAGES: "1" },
  stdio: "inherit",
  shell: false,
});

if (result.error) {
  throw result.error;
}

process.exitCode = result.status ?? 1;
