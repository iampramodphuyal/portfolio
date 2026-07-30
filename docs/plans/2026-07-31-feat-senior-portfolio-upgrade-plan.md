---
title: "feat: Senior Portfolio Upgrade — fix, polish, and engineering signals"
type: feat
status: completed
date: 2026-07-31
deepened: 2026-07-31
brainstorm: docs/brainstorms/2026-07-31-senior-portfolio-upgrade-brainstorm.md
---

# feat: Senior Portfolio Upgrade

## Enhancement Summary

**Deepened on:** 2026-07-31 · **Agents:** SpecFlow analyzer, Next.js 14.2 framework verifier (context7 + installed source), vitest/CI researcher, simplicity reviewer, TypeScript reviewer, security reviewer, architecture reviewer.

**Key improvements over the draft:**
1. **Live bug found:** the banner box in all 4 list curl handlers is misaligned today (50-char `═` borders vs 49-char title rows) — `util/curl-format.ts` gets a `banner()` that computes centering, fixing it everywhere at once.
2. **Security rule for the generator:** generated `config.sh` is bash sourced at request time inside the Vercel function — all `CARD_*` values MUST be emitted single-quoted via the `'\''` idiom. Double-quoted emission turns a `$(...)` in bio text into request-time code execution.
3. **Corrected framework claims:** public/robots.txt + app/robots.ts is *not* a build error in 14.2 — the public file silently shadows in prod and 500s in dev (action unchanged: delete in same commit). `/opengraph-image` has no dot and must be excluded from the broadened matcher **by name**. HEAD→GET fallback lives in Next's server layer, so a unit test for it is vacuous — moved to curl `-I` verification.
4. **Resequenced:** all code churn (curl 404, project rendering, not-found) now lands *before* the quality gates; content and README land after. Nothing is linted/tested twice.
5. **Cuts (simplicity + architecture consensus):** `error.tsx`, `@vercel/speed-insights`, vitest (→ `node:test` + `tsx`, zero config, relative imports), CalSans in the OG image, npm pre-hooks (→ generation inlined in scripts), the duplicate dot-skip guard in middleware.
6. **Expansions that remove whole drift classes:** generator emits *all* content vars (`CARD_BIO`, `CARD_REPO` too) so `public/curl/*.sh` becomes presentation-only; a shared `CURL_ROUTES` table feeds middleware, the curl banner, and a parity test — the "every page needs a curl counterpart" invariant becomes enforced, not documented. CI pins Node 22 (Node 20 EOL'd April 2026) and current action majors.

**Conflict resolved:** one reviewer claimed pnpm doesn't run `prebuild`; two agents verified empirically that pnpm 9.15.4 does (default since pnpm 8). Moot anyway — generation is inlined into `build`/`dev`/`test` scripts, which also survives Vercel build-command overrides.

## Overview

One-time upgrade pass making the live site (pramodphuyal.com.np) and the public repo read as senior-engineer work. Dual-mode curl/browser delivery stays the centerpiece; this removes everything that undercuts it: broken/placeholder content, missing SEO, an empty README, no CI/tests, and the content duplication the repo's own dormant plan (`docs/plans/2026-02-17-feat-unified-config-content-delivery-plan.md`) predicted would drift — and which has drifted.

Scope per brainstorm: **Tier 1 (fix + polish) + Tier 2 (engineering signals)**. Tier 3 deferred.

## Problem Statement

- Repo is public and is itself the portfolio, but README is 0 bytes, `.github/workflows/` is empty, there are no tests, and `pnpm lint` is broken (no eslint installed).
- 4 of 6 projects are literal placeholders — all `published: false` (repo-credibility issue, not a live-site bug).
- `/experience` renders a broken image (`/images/beena.png` missing); the curl banner boxes render misaligned (see Enhancement 1).
- Shared links render bare: no `metadataBase`/OG image/Twitter card; per-page metadata only on `/blog/[slug]`; `public/manifest.json` is CRA boilerplate.
- Live drift: title differs across `app/layout.tsx:11`, `public/curl/config.sh:42`, `public/curl/info.sh`; socials hardcoded in 4 places; site URL hardcoded 6× in curl handlers.
- Curl users hitting any unmatched path (`curl /foo`, `/resume`) get raw HTML dumped in their terminal.

## Technical Approach

### Phase 1 — Hygiene & broken fixes

| Task | Files |
|------|-------|
| Delete dead Pages-Router leftovers (verified unreferenced) — before ESLint exists | `components/*.js`, `styles/globals.css`, `assets/styles.css` |
| Extend `.gitignore`: `.DS_Store`, `next-env.d.ts` | `.gitignore` |
| Define missing `glow` keyframe (`animate-glow` in `app/page.tsx:28,36` is a silent no-op) — copy from chronark's config | `tailwind.config.js` |
| `bg-zinc-900/500` → deliberate `bg-zinc-900/80` | `app/components/nav.tsx:22` |
| Rewrite `public/manifest.json` (real name, `theme_color: #000`, icons → existing `android-chrome-*.png`); link via `metadata.manifest: "/manifest.json"`. Keep it a public file — an `app/manifest.ts` alongside it would be shadowed in prod / 500 in dev | `public/manifest.json`, `app/layout.tsx` |
| Beena logo: **user supplies `public/images/beena.png`**; everything else proceeds | `data/experience.ts:18` |
| `"typecheck": "tsc --noEmit"` script (local only; CI's type gate is `next build`) | `package.json` |

### Phase 2 — Single source of truth + curl refactor

1. **`data/site.ts`** — `export const site = {...} as const` (name, title → **"Software Engineer"**, bio, url, repo, email); derive types, never a hand-written interface. Keep it dependency-free (no JSX/lucide) — it's imported by the generator script, handlers, layout, sitemap, OG image. **Email lives only here**: `data/socials.ts` derives its entry (`handle: site.email, href: \`mailto:${site.email}\``).
2. **`data/socials.ts`**: add `export type SocialIcon = "linkedin" | "mail" | "github"`; type `icon: SocialIcon`. Consumers use exhaustive maps: `Record<SocialIcon, LucideIcon>` in contact (components, not pre-instantiated nodes), `Record<SocialIcon, string>` emoji map in the curl handler — note its current copy is *not* shape-identical (`url` vs `href`, emoji vs names); a naive import would print the literal string "linkedin" in terminals.
3. **Contact page — one pass**: `app/contact/page.tsx` uses no hooks → remove `"use client"`, import socials + icon map, export `metadata`. Client children (`Card`, nav) still render fine.
4. **`util/curl-format.ts`** (`util/` matches the repo's existing convention — no new `lib/` dir). Not just constants — the API that kills the real duplication:
   ```ts
   export const C_RESET = "\x1b[0m"; // … flat names, minimal refactor diff
   export function banner(title: string): string;   // computes centering — fixes the live 50-vs-49 misalignment in 4 handlers
   export function footer(path = ""): string;       // `← curl ${site.url}${path}` — kills 6 hardcoded URLs
   export function textResponse(body: string, status = 200): Response;
   ```
   Refactor all 5 TS handlers onto it. Resist the old plan's wider `table/wrap/keyValue` surface — constants + these three.
5. **`scripts/generate-curl-config.ts`** — emits `public/curl/config.sh` from `data/site.ts` + `data/socials.ts`, with a "GENERATED — do not edit" header. Rules:
   - **All values single-quoted via `const sq = (v: string) => `'${v.replace(/'/g, `'\\''`)}'`;`** — inside POSIX single quotes nothing else is special. Never emit data in double quotes (bash sources this file inside the request path). Static ANSI color preamble stays verbatim `$'\033[…]'` text.
   - Emit **all** content vars — `CARD_NAME/TITLE/WEBSITE/EMAIL/GITHUB/LINKEDIN` plus `CARD_BIO`, `CARD_REPO` — then make `public/curl/info.sh` and `endpoints.sh` consume vars instead of their hardcoded prose/domain. `public/curl/` becomes presentation-only; the info.sh drift class is eliminated, not accepted.
   - Relative imports in the script (`../data/site`), not `@/` — don't couple the script runner to tsconfig paths.
   - **Invocation inlined, not hooked**: `"build": "tsx scripts/generate-curl-config.ts && next build"`, same prefix for `dev` and `test`. (pnpm 9 does run pre-hooks, verified — but inlining survives Vercel build-command overrides and self-documents.) devDep: `tsx`.
   - `git rm --cached public/curl/config.sh` + gitignore it (it's tracked today); README notes standalone `bash card.sh` needs one prior `pnpm dev/build/test` or `pnpm tsx scripts/generate-curl-config.ts`.
6. **`util/curl-routes.ts`** — the route table both sides of the dual-mode boundary read:
   ```ts
   export const CURL_REWRITES = {
     "/": "/api/curl", "/projects": "/api/curl/projects", "/experience": "/api/curl/experience",
     "/blog": "/api/curl/blog", "/contact": "/api/curl/contact",
   } as const satisfies Record<string, `/api/curl${string}`>;
   export const isCurlRoute = (p: string) => p in CURL_REWRITES || p.startsWith("/blog/");
   ```
   Consumed by middleware (Phase 4), `curl-banner.tsx` (hide when `!isCurlRoute(pathname)` — the banner stops lying on future pages), and a parity test (Phase 5).

### Phase 3 — SEO, metadata, analytics & headers

1. **`app/layout.tsx`**: `metadataBase: new URL(site.url)`, `twitter: { card: "summary_large_image" }`; title/description from `data/site.ts`.
2. **`app/opengraph-image.tsx`**: `import { ImageResponse } from "next/og"` (nodejs is already the default runtime in 14.2 — no `runtime` export). Export `size`/`contentType`/`alt` conventionally. Terminal-window styling: `$ curl https://pramodphuyal.com.np` + name + title on black. **System fonts, period** — no CalSans loading.
3. **Per-page `metadata`** for `app/projects/page.tsx`, `app/experience/page.tsx`, `app/blog/page.tsx` (contact done in Phase 2) — one `export const metadata` line each through the `%s | Pramod Phuyal` template.
4. **`app/sitemap.ts`** (`MetadataRoute.Sitemap`: the 5 static pages + published posts from `data/blog.tsx`; never `/api/curl/*`) and **`app/robots.ts`** (`MetadataRoute.Robots`: allow all, `disallow: "/api/"` — crawler hygiene, not a security control; sitemap ref). **Delete `public/robots.txt` in the same commit** — in 14.2 the public file silently shadows the route in prod and 500s in dev.
5. **Analytics**: `@vercel/analytics` only (speed-insights cut — no one will look at it). `import { Analytics } from "@vercel/analytics/next"` in layout body — the `/next` entrypoint auto-tracks App Router navigations. Browser traffic only by design; curl usage is already visible in Vercel function logs.
6. **Security headers** in `next.config.mjs` `headers()`: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`. HSTS only if absent from the live response (Vercel usually injects it). CSP deliberately skipped (see non-goals).
7. **Resume**: move to `public/resume.pdf`; link from contact; add one line to `public/curl/endpoints.sh`. **User confirms the PDF is current and scrubbed** (it becomes crawlable) first.

### Phase 4 — Remaining code (lands BEFORE the quality gates)

1. **Middleware rewrite** around `CURL_REWRITES` (~20 lines, replaces the 6 if-blocks): table hit → rewrite; `/blog/` prefix → prefix rewrite; curl UA + anything else → plain-text 404 returned directly (allowed in 14.2; the old response-body flag is long gone):
   - Broadened matcher, **one mechanism only** (no runtime dot-guard): `"/((?!api|_next|opengraph-image|.*\\..*).*)"` — dotted paths (`robots.txt`, `sitemap.xml`, `manifest.json`, `favicon.ico`, `/resume.pdf`, fonts/images) are excluded by the `.*\..*` arm; **`opengraph-image` must be named** (no dot). Matcher stays a static literal (Next parses it at build time — it cannot be derived from the table).
   - 404 body: echo the path only sanitized — `pathname.replace(/[^\x20-\x7e]/g, "").slice(0, 120)` — and never `decodeURIComponent` it (terminal-escape injection via crafted URLs otherwise). Set `content-type: text/plain; charset=utf-8` and `X-Content-Type-Options: nosniff` explicitly (middleware responses bypass `headers()`).
   - Known edge, accepted: a future blog slug containing a dot would fall out of curl mode.
2. **`app/not-found.tsx`** — terminal-styled (`zsh: command not found`), link home. No `error.tsx` (cut — static data files, no realistic runtime-error path).
3. **Proprietary project rendering** (type change now, content drafts in Phase 6): meaning is a field, not inferred from missing links —
   ```ts
   export type Project =
     | (ProjectBase & { proprietary?: false; url?: string; repository?: string })
     | (ProjectBase & { proprietary: true; url?: never; repository?: never });
   ```
   `app/projects/article.tsx`: branch on `const href = project.url ?? project.repository` — link → current `<Link target="_blank">`; none → plain `<article>` + "Proprietary" badge. **Drop the `|| "#"` fallback and `target="_blank"` on the non-link variant.** Safe for hover styling — `group` lives on `Card`, not the Link. Curl projects handler prints `proprietary` from the flag.
4. Optional one-liners while touching `app/api/curl/route.ts`: `execFileSync("bash", ["card.sh"], …)` (drops the `/bin/sh -c` layer) and `Cache-Control: public, max-age=3600` (card is static per deploy; caps the cost of hammering a fork-heavy endpoint). The execSync pipeline itself was traced: **no request-controlled input reaches the shell — confirmed non-issue.**

### Phase 5 — Quality gates (now they see final code)

1. **ESLint**: `eslint@^8` (v9 unsupported by `eslint-config-next@14.2.28`) + `.eslintrc.json` `{"extends": "next/core-web-vitals"}` (flat config is Next 15+). Fix findings — known: raw `<a href="/blog">` in `app/blog/[slug]/page.tsx`.
2. **Tests — `node:test` + `tsx`, no vitest** (tsx is already in for the generator; zero config files): `"test": "tsx scripts/generate-curl-config.ts && node --import tsx --test test/*.test.ts"`. Relative imports in tests — no alias coupling. Smoke tests:
   - Each of the 5 TS handlers: `GET(new Request(url))` → 200, `content-type` contains `text/plain`, body contains a marker **derived from the data imports** (e.g., first `published: true` project title), never a hardcoded literal that Phase 6 content edits would break. `[slug]` handler takes `{ params: { slug } }` as its second arg (plain object in Next 14; becomes a Promise in Next 15 — note for any future upgrade).
   - Bash homepage handler: 200 + `site.name` marker (bash is a documented dev prerequisite; macOS bash 3.2 warnings are stderr-only).
   - Parity test (~10 lines): every `CURL_REWRITES` entry has a matching `app/api/curl/**/route.ts`, and every `app/**/page.tsx` is listed or deliberately excluded.
   - `banner()` width assertion in curl-format — the seam that keeps the box-alignment fix fixed.
   - **No HEAD unit test** — the GET→HEAD fallback lives in Next's server layer (`auto-implement-methods`), invisible to a handler import; `curl -I` covers it in Verification.
3. **CI** `.github/workflows/ci.yml` — push/PR to master, `permissions: { contents: read }`, `NEXT_TELEMETRY_DISABLED: 1`:
   `actions/checkout@v5` → `pnpm/action-setup@v6` (no version input — reads `packageManager`) **before** `actions/setup-node@v5` (`node-version: 22` — Node 20 EOL'd 2026-04; `cache: pnpm`) → `pnpm install --frozen-lockfile` → `pnpm lint` → `pnpm test` → `pnpm build` (build = type gate; **no bare `tsc --noEmit` step** — `next-env.d.ts` is gitignored and absent until a Next command generates it).

### Phase 6 — Content (drafted for user review) & README

1. **`data/projects.ts`** — delete placeholders; add 2 drafted entries with `proprietary: true`, **`published: false` until user edits** the bracketed [metrics]:
   - **Healthcare Provider Data Platform** (Beena/AudioBee, 2025–): "Distributed scraping platform extracting healthcare-provider directory data (NPIs, specialties, locations) from [N]+ insurance payer networks. Per-network crawler monorepo orchestrated across an Azure VM fleet with pm2, feeding an automated QA pipeline. Proprietary — built at Beena."
   - **Data QA & Comparison Tooling** (Beena/AudioBee): "Quality-assurance system for large-scale scraped datasets: run-over-run comparisons, field-level error scoring, sampling workflows, and automated verification of provider records against live directories. Surfaces regressions before delivery. Proprietary — built at Beena."
2. **`data/experience.ts`** — outcome-focused rewrites, **single `description: string` kept** (no bullets array — would force render changes in page + curl handler). [metric] placeholders: Beena (scale/networks), Grepsr (3.5 yrs — clients, reliability), Xelwel light touch.
3. **`README.md`** — the site; dual-mode architecture (middleware UA-sniff → `/api/curl/*`; bash card on `/`, ANSI TS handlers elsewhere; `CURL_REWRITES` as the shared route table); curl examples + deliberate curl-only scope (wget/HTTPie get HTML; libcurl UAs get ANSI; UA check is case-sensitive); stack; local dev (pnpm, bash prerequisite, config.sh generation); CI badge; chronark design credit.

## Explicit non-goals (decisions, not omissions)

- **wget/HTTPie/Accept negotiation**; **`Vary: User-Agent`** (middleware precedes Vercel's edge cache — revisit only on a mixed-mode report).
- **CSP** — nonce plumbing through middleware is disproportionate for a no-input, no-session site (README-worthy line). The cheap headers in Phase 3.6 are the proportionate set.
- **`error.tsx`**, **`@vercel/speed-insights`**, **vitest** (node:test + tsx is leaner at 6 smoke tests), **CalSans in OG image**, **server-side curl `track()` events** — cut; Vercel function logs cover curl visibility.
- **Blog dual-payload authoring** stays manual (1 post); **MDX/CMS, theme toggle** stay rejected per the 2026-02-17 migration plan; **test coverage stays smoke-level**.
- **Tier 3**: curl `/resume` ANSI endpoint, `/uses`, per-project curl endpoints, GitHub activity, contact form.

## Acceptance Criteria

- [x] `pnpm lint`, `pnpm test`, `pnpm build` pass locally (CI run pending first push); CI badge in README
- [x] `curl -A curl localhost:3000/{,projects,experience,blog,contact}` return ANSI text with **correctly aligned banner boxes**; homepage card says "Software Engineer"; `curl -A curl localhost:3000/nonexistent` → plain-text 404 (sanitized echo); `curl -I -A curl localhost:3000/` → 200
- [x] Browser pages unchanged visually except: no broken image path pending user asset (beena.png), dead `animate-glow` class removed (upstream chronark never defined it either — keyframe would have overridden fade-left, so deletion, not definition), terminal 404, resume link, banner hidden on non-curl routes
- [x] `/opengraph-image` renders; `/sitemap.xml` = 5 static pages + published posts (no `/api/curl/*`); `/robots.txt` from `app/robots.ts` with `Disallow: /api/`; distinct `<title>` per page; `/manifest.json` names the real site; security headers present on page responses
- [x] Single source: `rg "pramod.phuyal@outlook|Software Developer|pramodphuyal\.com\.np" --glob '!data/**' --glob '!README.md' --glob '!docs/**'` finds no hardcoded copies in app/util/scripts/public-shell code (generated config.sh is gitignored)
- [x] README non-empty; zero placeholder text in `data/`; proprietary entries render without dead links in both modes; **projects page shows 4 published projects only after user reviews drafts and flips `published`** (tests assert against currently-published data, so they stay green either way)
- [ ] All drafted content (projects, experience, title) reviewed/edited by user before `published: true` / merge
- [ ] Vercel Analytics shows browser pageviews after deploy

## Dependencies & Risks

| Risk | Mitigation |
|------|-----------|
| Generator quoting bug = request-time shell execution | Single-quote-only emission (`'\''` idiom); control-char assertion in generator; never `$"…"` for data |
| Gitignored config.sh breaks fresh clones / standalone card.sh | Generation inlined in `dev`/`build`/`test` scripts; README note; `git rm --cached` step explicit |
| Broadened matcher intercepts something it shouldn't | Single lookahead mechanism incl. named `opengraph-image`; verification curls `/sitemap.xml`, `/robots.txt`, `/resume.pdf` after the change |
| ESLint surfaces violations | Runs after all churn; `next/core-web-vitals` only; fix or targeted-disable with comment |
| Missing `beena.png` | User action; independent |
| Drafted proprietary content wrong in details | `published: false` gate until user edits |
| OG caches serve stale cards | Force re-scrape (LinkedIn Post Inspector / Slack) post-deploy |
| New deps: runtime `@vercel/analytics`; dev `eslint`, `eslint-config-next`, `tsx` | 1 runtime + 3 dev, all standard; lifecycle hooks: 0 |

## Verification

1. `pnpm install && pnpm lint && pnpm test && pnpm build`
2. `pnpm dev`: `curl -A curl localhost:3000/` (card, "Software Engineer", aligned box), `/projects` (proprietary label, no dead URLs), `/experience`, `/blog`, `/contact`; `curl -A curl localhost:3000/bogus` (plain-text 404); `curl -I -A curl localhost:3000/` (200 — this is where GET→HEAD is actually exercised); `curl localhost:3000/sitemap.xml` and `/robots.txt` and `/resume.pdf` (real content, not ANSI/404 — proves matcher exclusions)
3. Browser: `/` glow, `/experience` images, `/contact` icons + resume link, `/nonexistent` terminal 404, per-page `<title>`/OG in view-source, `/opengraph-image`, `/manifest.json`; response headers show nosniff/frame-options/referrer-policy
4. Push branch → CI green → Vercel preview → rerun curl checks against the preview URL → paste into LinkedIn Post Inspector / Slack to verify the OG card
5. Production deploy → force OG re-scrape (platforms cache for days) → Analytics shows pageviews; function logs show `/api/curl/*` hits

## References

- Brainstorm: `docs/brainstorms/2026-07-31-senior-portfolio-upgrade-brainstorm.md`
- Dormant plan completed by Phase 2 (its generator/dedup decisions upheld; its `table/wrap` utility surface and hook-based lifecycle rejected): `docs/plans/2026-02-17-feat-unified-config-content-delivery-plan.md`
- Migration plan (curl architecture + rejected alternatives): `docs/plans/2026-02-17-feat-chronark-style-portfolio-migration-plan.md`
- Key files: `middleware.ts`, `app/layout.tsx`, `data/{projects,experience,socials}.ts`, `public/curl/{config,info,endpoints}.sh`, `app/projects/article.tsx`, `app/components/curl-banner.tsx`, `app/api/curl/*/route.ts`, `vercel.json`, `next.config.mjs`
- Framework facts verified against installed `next@14.2.28` source + Next 14 docs (opengraph-image, metadata routes, middleware response bodies, auto HEAD); CI facts: Node 20 EOL 2026-04-30, `pnpm/action-setup@v6` before `setup-node` for `cache: pnpm`, pnpm runs pre-scripts since v8 (verified on 9.15.4)
