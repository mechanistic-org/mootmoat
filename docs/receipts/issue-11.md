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

Production acceptance passed at 2026-09-05T00:15:44.391Z (2026-09-04 Pacific). The approved V18 result is live on both properties. This child receipt supplies every controller acceptance criterion; the issue-close transaction publishes the evidence-backed dispositions and reconciles #7.

## Release image and order

The committed `docs/release-assets/mootmoat_v18.png` was verified against `issue-10-files.json`: SHA-256 `39b53aa046fdf390d45aa8d6b5f8ea5de62033f3b1a11a0d01ae79d6340b45f7`, 31,640 bytes, 1200 by 630 pixels. Wrangler uploaded those exact bytes to `assets-mootmoat-com/mootmoat_v18.png` with `image/png` and immutable versioned caching. Public checksum verification passed at 2026-09-04T23:50:10Z before the first V18 metadata deployment. A direct Wrangler R2 download also matched. An earlier legacy S3 preflight was rejected as Unauthorized before any write; the established Wrangler OAuth path succeeded.

The accepted MootMoat and portfolio main commits were built and deployed through their committed `wrangler.production.jsonc` configurations. Portfolio has no source changes in #11; its accepted #10 change remains exactly one href in `src/config/bio_nodes.ts`.

## Necessary release defect

The first V18 deployment exposed an inherited interaction between the #9 slash policy and the retained dynamic R2 endpoint. The actual generated `/assets/[...path]` route required a final slash under `trailingSlash: "always"`; filename URLs bypassed Astro's slash redirect and fell through to the static 404. The exact metadata image URL returned 404 on both production domains while the slash-suffixed URL and direct R2 read worked.

`astro.config.mjs` now uses `trailingSlash: "ignore"`. The generated asset route accepts the exact PNG URL; content links and canonicals still use their approved slash-terminated URLs. No doctrine, portfolio design, asset-handler code, R2 key, or production Worker binding changed.

Regression evidence: `node scripts/check-worker-routing.mjs` failed on the pre-fix generated manifest and passed after rebuilding. `node scripts/check-release-image.mjs http://127.0.0.1:4398` failed with 404 before the fix and passed with HTTP 200, image/png, and the exact checksum after it. The pinned local workerd could not support the production compatibility date, so the local fixture used a process-only 2026-07-29 override; production configuration remains unchanged. The final live regression and complete production acceptance both passed at the actual unchanged production compatibility date.

## Build and regression validation

- Both locked npm installations passed.
- MootMoat production build, content check, and 24 local presentation checks passed before deployment.
- Portfolio full production build, publication gates, and both Worker packaging dry-runs passed. Its Pagefind index contains 149 pages; its existing `/docs/` fragment warning is outside the cross-link change.
- After the routing fix, MootMoat build, generated-route regression, local exact-image regression, seven-route content/sitemap/search inventory, 236 internal links/fragments, and Worker packaging passed.
- `npm run lint` failed with exit 2: `Cannot find module 'typescript'`. The manifest does not declare the TypeScript peer required by the retained typescript-eslint stack. This is the inherited #9/#10 tooling limitation, not a passing check; no lint dependency or configuration migration is included in the bounded release.

## Production acceptance

| Surface | Observed result |
| --- | --- |
| Production build / live parity | All seven live HTML responses have SHA-256 parity with the accepted final local production build. Both fresh locked installations and both production builds passed. |
| Pagefind | Seven English pages indexed. Live UI query `provenance` returns workbook, FAQ, and doctrine, including subsection results; activating the workbook result navigates and closes search. API results were read back as current content. Partial matching for `Solstice` returns current snippets containing `so`, not retired template content. |
| Sitemap / robots | Exactly the seven approved content URLs in the production sitemap. robots.txt points to MootMoat's sitemap and contains no template identity. |
| Navigation / fragments | All 236 internal links and fragment targets pass. Mobile menu navigation closes the dialog; Escape restores trigger focus. Direct workbook `#01-provenance-chain` navigation reaches the visible heading after scrolling settles. |
| 404 behavior | Unknown page, retired French home/docs, retired getting-started/components, and the three unimplemented machine-endpoint URLs all return a branded HTTP 404 with noindex. Missing R2 object returns HTTP 404. No retired route is silently revived. |
| Widths / visual inspection | All seven pages plus 404 pass at 1440, 768, 390, and 320 CSS pixels: 32 checks, no horizontal overflow, one heading, loaded JetBrains Mono, correct app metadata, and one portfolio return link. Desktop home/doctrine and narrow workbook/search screenshots were visually inspected. |
| Branding / R2 | MootMoat manifest/icons and black theme metadata pass; icons decode at declared sizes. Social metadata uses the exact versioned R2 PNG on every page; public PNG checksum, MIME, 1200x630 dimensions, and immutable cache metadata pass. |
| Keyboard / theme | Skip link receives first Tab. The existing desktop theme control works and its light choice survives navigation; dark can be restored. |
| Cross-links | At 1440px, the hydrated portfolio SVG control responds to Enter; at 390px its native anchor responds to click. Both reach `https://mootmoat.com/`, and the live footer returns to `https://eriknorris.com/`. No network destination was stubbed. |
| Headers / domains | HTML is text/html with nosniff, strict-origin-when-cross-origin, and revalidation caching. Root and www endpoints for both properties return 200. The established static CORS/header policy is retained; the R2 object uses versioned immutable caching. |
| External links | All four rendered external destinations return 200: portfolio root, MootMoat GitHub, HBS/Accenture source, and O*NET source. |
| Browser failures | No exceptions or failed non-navigation MootMoat resources during the page and interaction checks. Expected 404 navigation is tested separately. |

The acceptance harness was corrected during verification for Pagefind partial matching, numeric fragment selectors, scroll completion, SVG focus, explicit island hydration, and destination readiness. Those were test assumptions, not additional site changes. Transport retries are bounded and logged; HTTP/content assertion failures are not retried or treated as passes. The complete final `npm run check:production` run exits 0.

### Deployed revisions

- MootMoat accepted implementation: `2373869814f67dd395dee28c4c96a3657eb521c6`, followed by the necessary release fix [`27e6b454130bfa0301bc8f05e4291749c9d65c67`](https://github.com/mechanistic-org/mootmoat/commit/27e6b454130bfa0301bc8f05e4291749c9d65c67).
- MootMoat final Worker version: `fc4838f0-c073-4d36-978e-259003339913`, deployed with `wrangler.production.jsonc` and the existing production routes/R2 binding.
- Portfolio source: [`b3451089c662fe01e39e1e7e5f08a6519a387d31`](https://github.com/mechanistic-org/portfolio/commit/b3451089c662fe01e39e1e7e5f08a6519a387d31). Final Worker version: `920f4b6f-eb5e-44e9-b11c-d31f66dd3a2e`, deployed with its existing production configuration.
- Later #11 receipt/verifier commits change no deployed page, doctrine, image, Worker binding, or portfolio source.

### Exact production HTML evidence

| Route | SHA-256 (live equals built) |
| --- | --- |
| `/` | `47fb1cfee53b7967f126c0f0714ec2ef5cdcf4cbf5b9364ac52c0577a61f183d` |
| `/docs/` | `b1c34615b2b188b79c4db59aa08710d02deef13cc475525d2fb7184de617ea2a` |
| `/docs/what-is-mootmoat/` | `64822f9805a3ec2e929745c0db4da5c00860435424d0611fd35adbfb8cd199c4` |
| `/docs/doctrine/` | `5bb6d2c069319134d5443bfdede0d4c5850a83207f14576fb789b614226c6841` |
| `/docs/workbook/` | `20de8083424bec5d4747aec9c05511a7261bc37fc4b49666f5755859492bfa15` |
| `/docs/faq/` | `3746ea99ceb733c95e9c83b54431a26e6d31872c4be7f47ed03ab730ccc88797` |
| `/docs/ontology-gap/` | `6d65cf51021fd40c0176a63baf7b72e392e35df1a718da4b928e572a9be9a6c1` |

## Absorbed-ticket dispositions

All four tickets were already Closed / Done on the Main Board when cold-read. Their July consolidation comments are historical bookkeeping, not the delivery evidence used here. The final #11 transaction adds the following observed-delivery records without reopening or reclosing them.

| Ticket | Delivered / observed | Superseded or excluded | Final disposition |
| --- | --- | --- | --- |
| global_agent#89 | Aesthetic/template teardown, typography, landing/navigation, live doctrine and portfolio connection, evidenced by #9/#10 and this production receipt. | Spoke Scraper and ingestion automation are not delivered or claimed. NanoClaw/swarm and thirty-ticket execution are killed. Earlier absolute ATS/identity narrative is superseded by bounded DIY doctrine. | Retain Closed / Done as superseded, with surviving site outcomes evidenced. |
| mootmoat#3 | Template marketing/components/images/root residue removed; accepted doctrine integrated into home/navigation/sidebar; branding replaced and verified live. Isomorphic Proof remains absent. | V17 hydration is replaced by the approved current-doctrine rewrite. | Retain Closed / Done; surviving strip-down outcomes are now verified. |
| mootmoat#4 | Author-controlled DIY evidence method, source discipline, optional authoring structure, workbook, and explicit limits are published and verified. | Unsupported protocol/schema/validator and ATS-bypass ambitions are not hidden implementation requirements. | Retain Closed / Done; approved rewrite delivered. |
| mootmoat#6 | V17-purge and publication intent delivered through the authorized worktree/main/Worker release. | OpenClaw/agent-product exposition, Project 6 CEO dashboard, and client-template scaling claims were killed or excluded, not implemented. Historical PR wording is replaced by the currently authorized trunk release. | Retain Closed / Done as superseded; other historical board projections are untouched. |

No original killed requirement is marked implemented. No separate ingestion, scraper, dashboard, client-template, swarm, or portfolio redesign work is started. Each issue receives its own evidence-backed comment linking this receipt and the approved ruling.

## Binary controller acceptance

| #7 criterion / original outcome | Evidence |
| --- | --- |
| Every original item has an evidenced ruling/disposition | Operator-approved #8 ruling; exhaustive #9/#10 source inventories; four item-specific dispositions above and accompanying issue records. |
| Production passes build/search/mobile/link/live checks | Both production builds; final live suite exit 0; seven exact HTML hashes, seven sitemap/search pages, 236 links/fragments, 32 width checks, exact R2 bytes, real bidirectional links. |
| Retained doctrine is coherent, sourced, and free of stale template residue | Accepted #9 source-to-ruling mapping and source metadata/content guard; doctrine bytes unchanged through #10/#11; live build parity; no contradictory current copy or retired route. |
| Implementation evidence lives in child receipts | #8 ruling, #9 receipt/inventory, #10 receipt/inventory, and this #11 final receipt. Parent contains status/acceptance links only. |
| Original residue removal | #9 exact inventory and seven-route output verify French/Netlify/root functions/components/debris dispositions. |
| Original design and cross-link requirements | #10 changed-surface inventory plus #11 live widths, brand/R2 and actual cross-link activation. |
| Original supersession/closure requirement | All four are already Closed / Done and receive observed-delivery supersession/disposition records in this transaction. Closure is not inferred from absorption. |

No V18 runtime or approved implementation blocker remains. The inherited lint failure is explicit below and is not represented as a hidden Epic implementation item.

## Limits and closeout

`npm run lint` remains **failed, exit 2, missing TypeScript peer**. It failed identically after the clean #11 installation. It is the accepted inherited tooling limitation from #9/#10; it is not a runtime release gate in the approved V18 DoD and no passing lint result is claimed. The portfolio build's existing Pagefind fragment warning and readiness-report hints are also not represented as clean lint or new cross-link defects.

The only V18 runtime fix is slash-tolerant R2 routing. Owned files are `astro.config.mjs`, `package.json`, `README.md`, `scripts/check-worker-routing.mjs`, `scripts/check-release-image.mjs`, `scripts/check-production.mjs`, and this receipt. The committed release PNG, five accepted MDX documents, R2 handler, and both production Worker configurations are unchanged. Portfolio has zero #11 source changes.

The primary checkouts' pre-existing files remain byte-identical to their declared baselines. MootMoat's shared checkout remains at its original revision because its pre-existing modified lockfile prevents fast-forward; the isolated accepted work is on origin/main. Local logs, screenshots, diagnostic fixtures, and exact task provenance remain local and ignored. Baseline declaration/stamping preceded mutation; the Codex runtime/open-telemetry supplement was performed late and recorded honestly in local close state. The shared lifecycle logger records close; no new registry/timeline surface is created in this site repository.

The final transaction lands the receipt/verifier, runs reachability/push/artifact/DoD gates, publishes deterministic commit/validation evidence and all four dispositions, closes #11 / Done on the Main Board, reconciles and closes #7 only after those records are live, clears baselines/releases lanes, and stops. The final issue receipt records the resulting commit and verified GitHub/Main Board state.
