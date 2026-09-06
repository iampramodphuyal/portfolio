---
date: 2026-07-31
topic: senior-portfolio-upgrade
---

# Senior-Engineer Portfolio Upgrade

## What We're Building

A one-time upgrade pass that makes both the live site (pramodphuyal.com.np) and the public repo read as the work of a senior engineer with ~4 years experience. The dual-mode curl/browser delivery stays the centerpiece — nothing here replaces it; everything here removes the things that undercut it.

**Scope decided: Tier 1 (fix + polish) + Tier 2 (engineering signals).** Tier 3 (new differentiator features) is captured as a future backlog, not part of this effort.

## Why This Approach

Audience is balanced (recruiters + engineers + potential clients) and writing appetite is minimal. That rules out a content-heavy strategy (regular blogging, long case studies) and rules in engineering-signal work: the repo is public and *is* the portfolio, so CI, tests, a real README, and finishing the repo's own unfinished refactor plan are the highest credibility-per-hour investments. Rejected alternatives: content-pipeline investment (MDX/CMS — already rejected in `docs/plans/2026-02-17-feat-chronark-style-portfolio-migration-plan.md`, and pointless at 1 post), dark/light toggle (explicitly rejected in the same doc), full Tier 3 feature build (deferred).

## The List (ranked by impact-per-effort)

### Tier 1 — Fix what's broken or embarrassing (these actively hurt right now)

1. **Write the README.** It's 0 bytes. This is the single worst signal in the repo. One-time writing: what the site is, the dual-mode curl architecture (middleware UA-sniff → `/api/curl/*` rewrites, bash card on `/`, ANSI TS handlers elsewhere), stack, local dev, chronark design credit. Doubles as the "technical writing sample" without needing a blog.
2. **Projects: replace the 4 placeholders** (`data/projects.ts`, "Description of your third project goes here"). Draft 2–3 entries from real AudioBee work (healthcare-provider scraping platform, QA/data tooling) as proprietary/no-link case entries; user reviews and corrects before publish. Delete whatever isn't kept.
3. **Fix the broken image on /experience** — `data/experience.ts:15` references `/images/beena.png`, which doesn't exist in `public/images/`.
4. **Fix the CRA-boilerplate `public/manifest.json`** — currently says `"name": "Create React App Sample"` and points at icons that don't exist. Rewrite for the actual site and link it from layout metadata.
5. **Delete dead Pages-Router leftovers** — unreferenced `components/*.js`, `styles/globals.css`, `assets/styles.css`.
6. **Fix content drift** — bio/title differ across `app/layout.tsx` ("Software Engineer / Service Delivery Engineer"), `public/curl/config.sh` ("Software Developer"), and `public/curl/info.sh`. Pick one title; Tier 2 item #12 prevents recurrence.
7. **SEO baseline (one-time, benefits all three audiences):**
   - `metadataBase` + Open Graph image (dynamic `opengraph-image.tsx` via `ImageResponse` — no design work) + Twitter card. Right now a shared link renders bare.
   - Per-page `metadata` for `/projects`, `/experience`, `/blog`, `/contact` (contact needs its client component split out — it's `"use client"` today).
   - `app/sitemap.ts` + `app/robots.ts` (App Router native, ~10 lines each; current robots.txt is a stub).
8. **Analytics: add `@vercel/analytics` (+ Speed Insights)** — zero-config, free tier; currently flying blind on whether anyone even uses the curl endpoints.
9. **Link the resume** — `public/images/resume.pdf` ships today but nothing references it. Add it to nav/contact (and see Tier 3 for `curl /resume`).
10. **Small hygiene batch:** add `.DS_Store` + `next-env.d.ts` to `.gitignore`; fix the broken `lint` script (no eslint installed — add eslint or remove the script); define the missing `animate-glow` keyframe used in `app/page.tsx:28,36` (silently a no-op now); make `nav.tsx:22` `bg-zinc-900/500` a deliberate `/80` or `/95`.

### Tier 2 — Engineering signals (what makes the repo read senior)

11. **CI pipeline** — `.github/workflows/` exists and is empty. One workflow: typecheck, lint, build (and tests once #14 exists). A green checkmark on a public portfolio repo is a cheap, real signal.
12. **Finish the unified-config plan** (`docs/plans/2026-02-17-feat-unified-config-content-delivery-plan.md` — written, never executed, and the drift it predicted happened): single source of truth in `data/` for socials/bio/title. Socials currently live in 4 places (`data/socials.ts`, `app/contact/page.tsx`, `app/api/curl/contact/route.ts`, `public/curl/config.sh`). Generate `config.sh` from TS data at build time.
13. **Shared `lib/curl-format.ts`** — ANSI color constants are copy-pasted into all 5 TS curl handlers.
14. **Smoke tests for the curl endpoints** — a handful of vitest tests asserting each `/api/curl/*` handler returns 200 + expected markers. The curl feature is the differentiator; it deserves the repo's only tests. Nothing beyond smoke level.
15. **Terminal-styled `not-found.tsx`** — currently no 404 page; a `command not found`-styled one is small and on-brand. (Add `error.tsx` while at it.)
16. **Experience bullets with outcomes** — light editing pass on `data/experience.ts`: scale/impact numbers where they exist ("scraped N providers across M networks"), not responsibilities. The one writing task besides the README, drafted for user review like the projects.

### Tier 3 — Future backlog (explicitly deferred, not in scope)

- `curl pramodphuyal.com.np/resume` → ANSI resume or PDF download
- `/uses` page tied to the dotfiles repo
- Per-project curl endpoints (`/api/curl/projects/[slug]`)
- GitHub contribution/activity on homepage
- Real contact form (only matters if freelance inbound becomes a goal)

## Key Decisions

- **Tier 1 + Tier 2 scope; Tier 3 deferred** — repo credibility over new features.
- **Minimal-writing strategy**: README + drafted-for-review project/experience entries are the only writing; no blog investment (1 existing post stays as-is, dual-payload authoring pain not worth solving at this volume).
- **Project placeholders → drafted real-work entries** (proprietary, no code links) generated from AudioBee context for user review — not deleted, not left as placeholders.
- **Keep prior rejections**: no MDX/Contentlayer, no theme toggle (per `docs/plans/2026-02-17` migration plan).
- **Conventional defaults, no debate needed**: Vercel Analytics for analytics, vitest for tests, single GitHub Actions workflow for CI.

## Resolved Questions

- Audience? → All three (recruiters, engineers, clients), balanced.
- Writing appetite? → Minimal; rank engineering work above content.
- Scope? → Tier 2 (fix/polish + engineering signals).
- Placeholder projects? → Claude drafts entries from real AudioBee work; user edits before publish.

## Open Questions

None — all resolved above. Implementation details (exact test cases, config.sh generation mechanism, OG image design) belong to the planning phase.

## Next Steps

→ Run `/workflows:plan` to sequence the implementation (suggested order: hygiene batch → SEO → refactor/tests/CI → drafted content for review).
