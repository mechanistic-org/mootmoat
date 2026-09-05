# Issue #15: restore reproducible ESLint checks

Date: 2026-09-05

Sources:
- [Standalone tooling contract](https://github.com/mechanistic-org/mootmoat/issues/15)
- [Historical V18 release receipt](https://github.com/mechanistic-org/mootmoat/blob/6e824c5702521cf57e343fa25a7e5f1460fc8a9c/docs/receipts/issue-11.md)
- `package.json`, `package-lock.json`, and the installed `typescript-eslint@8.38.0` peer metadata

## Result and change boundary

The retained ESLint command now starts and exits 0 after a clean locked install. It reports **zero errors and ten existing import-order warnings**. This receipt resolves the tooling limitation recorded by #9-#11; their historical results remain unchanged.

`package.json` declares the exact development dependency `typescript: 5.8.3`, satisfying typescript-eslint 8.38.0's `>=4.8.4 <5.9.0` peer range. The npm lockfile adds that package and the root declaration. Every pre-existing locked package record is unchanged. The README now describes the observed passing lint result and its warnings.

The four changed files are `package.json`, `package-lock.json`, `README.md`, and this receipt. No ESLint configuration, rules, ignore patterns, application source, scripts, doctrine, branding, Worker configuration, portfolio files, or historical receipts changed. No deployment occurred.

## Reproduction and isolation

The baseline was `6e824c5702521cf57e343fa25a7e5f1460fc8a9c` from current origin/main. A clean `npm ci --no-audit --no-fund` succeeded, but `npm run lint` exited 2 with `Cannot find module 'typescript'` from typescript-eslint's parser stack.

The first provisional worktree was nested beneath the shared checkout. Node's parent-directory module lookup borrowed TypeScript from that checkout, yielding a misleading successful lint run. Before implementation, the untouched worktree was moved to a sibling workspace outside that dependency ancestry; the inherited failure reproduced there. The accepted clean-install and verification results below all use that physically isolated worktree. After the fix, `require.resolve('typescript')` was asserted to resolve inside its own `node_modules`.

Runtime: Node.js 24.11.1, npm 11.17.0. The existing ESLint 9.32.0, typescript-eslint 8.38.0, Astro 5.12.3, and Pagefind 1.3.0 versions were retained.

## Verification

| Command or check | Exit | Observed result |
| --- | ---: | --- |
| Baseline `npm ci --no-audit --no-fund` | 0 | Locked installation succeeded. |
| Baseline isolated `npm run lint` | 2 | Expected reproduction: missing TypeScript. |
| Fixed `npm ci --no-audit --no-fund` | 0 | Clean installation from the updated lockfile succeeded. |
| Fixed `npm run lint` before build | 0 | Zero errors, ten existing warnings. |
| `npm run build:worker` | 0 | Astro/Worker build and English Pagefind index succeeded. |
| `npm run check:content` | 0 | Seven routes, seven sitemap entries, seven indexed pages, 236 internal links/fragments, twelve workbook canvases. |
| `npm run check:design` | 0 | Existing responsive, navigation, search, keyboard, theme, icon, and social-image checks passed. |
| `npm run check:worker` | 0 | R2 filename route regression and Wrangler 4.114.0 dry-run packaging passed. |
| Fixed `npm run lint` after all build checks | 0 | Zero errors, the same ten warnings; generated outputs did not break lint. |
| `npm ls typescript typescript-eslint` | 0 | TypeScript 5.8.3 resolved and deduplicated under the retained tooling. |
| In-memory ESLint positive/negative probes | 0 | Typed source parsed; `debugger;` still produced a severity-2 `no-debugger` error. |
| Lockfile identity comparison | 0 | Only `node_modules/typescript` added; every existing package record unchanged. |
| `git diff --check` and shared-checkout hash comparison | 0 | No whitespace errors; pre-existing lockfile and workspace-file bytes preserved. |

The in-memory probes used the actual ESLint API and a `src/tooling-probe.ts` filename. The accepted positive input was `const value: number = 1; console.log(value);`; the negative input was `debugger;`. No probe file or extra test framework was added.

The ten warnings are all `simple-import-sort/imports`: `astro.config.mjs`, DocsLogo, Footer, DocsPagination, Nav, SidebarNav, Seo, DocsLayout, the 404 page, and the home page. They remain warnings under the existing policy. No formatting sweep or rule suppression was used to claim a pass.

## Close disposition

Release only this standalone tooling ticket after the four files reach origin/main and the landed-state guards pass. #7-#11 remain completed; this work creates no new campaign frontier. The final issue comment records the landed commit and Main Board disposition. The shared checkout's modified `package-lock.json` and untracked `mootmoat.code-workspace` remain outside this transaction.
