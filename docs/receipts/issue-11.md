---
title: MootMoat issue 11 - V18 production release and disposition receipt
sources:
  - https://github.com/mechanistic-org/mootmoat/issues/11
  - https://github.com/mechanistic-org/mootmoat/issues/7
  - https://github.com/mechanistic-org/mootmoat/issues/8#issuecomment-5546452747
  - https://github.com/mechanistic-org/mootmoat/blob/d2705b5a29cf2c9c71badd6624df4bc8a3594689/docs/receipts/issue-9.md
  - https://github.com/mechanistic-org/mootmoat/blob/2373869814f67dd395dee28c4c96a3657eb521c6/docs/receipts/issue-10.md
  - https://github.com/mechanistic-org/portfolio/commit/b3451089c662fe01e39e1e7e5f08a6519a387d31
---

# V18 release verification

Release in progress. Final live acceptance and ticket disposition remain pending until the complete production check passes. No completion claim is made by this intermediate fix receipt.

## Release image and order

The committed `docs/release-assets/mootmoat_v18.png` was verified against `issue-10-files.json`: SHA-256 `39b53aa046fdf390d45aa8d6b5f8ea5de62033f3b1a11a0d01ae79d6340b45f7`, 31,640 bytes, 1200 by 630 pixels. Wrangler uploaded those exact bytes to `assets-mootmoat-com/mootmoat_v18.png` with `image/png` and immutable versioned caching. Public checksum verification passed at 2026-09-04T23:50:10Z before the first V18 metadata deployment. A direct Wrangler R2 download also matched. An earlier legacy S3 preflight was rejected as Unauthorized before any write; the established Wrangler OAuth path succeeded.

The accepted MootMoat and portfolio main commits were built and deployed through their committed `wrangler.production.jsonc` configurations. Portfolio has no source changes in #11; its accepted #10 change remains exactly one href in `src/config/bio_nodes.ts`.

## Necessary release defect

The first V18 deployment exposed an inherited interaction between the #9 slash policy and the retained dynamic R2 endpoint. The actual generated `/assets/[...path]` route required a final slash under `trailingSlash: "always"`; filename URLs bypassed Astro's slash redirect and fell through to the static 404. The exact metadata image URL returned 404 on both production domains while the slash-suffixed URL and direct R2 read worked.

`astro.config.mjs` now uses `trailingSlash: "ignore"`. The generated asset route accepts the exact PNG URL; content links and canonicals still use their approved slash-terminated URLs. No doctrine, portfolio design, asset-handler code, R2 key, or production Worker binding changed.

Regression evidence: `node scripts/check-worker-routing.mjs` failed on the pre-fix generated manifest and passed after rebuilding. `node scripts/check-release-image.mjs http://127.0.0.1:4398` failed with 404 before the fix and passed with HTTP 200, image/png, and the exact checksum after it. The pinned local workerd could not support the production compatibility date, so the local fixture used a process-only 2026-07-29 override; production configuration remains unchanged. Final production acceptance must run at the actual production date.

## Validation so far

- Both locked npm installations passed.
- MootMoat production build, content check, and 24 local presentation checks passed before deployment.
- Portfolio full production build, publication gates, and both Worker packaging dry-runs passed. Its Pagefind index contains 149 pages; its existing `/docs/` fragment warning is outside the cross-link change.
- After the routing fix, MootMoat build, generated-route regression, local exact-image regression, seven-route content/sitemap/search inventory, 236 internal links/fragments, and Worker packaging passed.
- `npm run lint` failed with exit 2: `Cannot find module 'typescript'`. The manifest does not declare the TypeScript peer required by the retained typescript-eslint stack. This is the inherited #9/#10 tooling limitation, not a passing check; no lint dependency or configuration migration is included in the bounded release.

## Acceptance still pending

The full live check covers exact built HTML, Pagefind UI/API, sitemap, navigation and fragments, expected 404s, 1440/768/390/320 widths, branding metadata/icons, exact R2 bytes, and real desktop/mobile navigation in both cross-link directions. This receipt will be finalized with observed results and the four absorbed-ticket dispositions after that check passes.
