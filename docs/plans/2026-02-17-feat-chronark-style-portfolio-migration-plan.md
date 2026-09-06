---
title: "feat: Migrate Portfolio to chronark.com-Style Layout"
type: feat
status: active
date: 2026-02-17
---

# Migrate Portfolio to chronark.com-Style Layout

## Overview

Migrate the existing PramodPhuyalPortfolio from its current card-based layout (Next.js 14 Pages Router, JavaScript, Tailwind CSS) to a dark, minimalist chronark.com-inspired design using Next.js App Router with TypeScript. The migration must preserve the existing **dual-mode** functionality: a curl-friendly terminal output and a browser-based UI.

The chronark.com source code is already available locally at `/Users/pramodphuyal/Documents/projects/portfolio/chronark.com/` for reference.

---

## Problem Statement / Motivation

The current portfolio (v2.5.47) uses an older Next.js Pages Router architecture with JavaScript. While functional, it has:

- **Dated visual design** -- Card-based layout with basic Tailwind utilities lacks the visual sophistication of modern developer portfolios
- **No TypeScript** -- Missing type safety across the codebase
- **Pages Router** -- Not leveraging Next.js App Router features (React Server Components, nested layouts, improved data fetching)
- **No content management** -- All data is hardcoded in React components
- **Limited interactivity** -- No particle effects, no mouse-tracking card hover effects, no entrance animations

The chronark.com design achieves visual impact through minimalism: pure black backgrounds, large CalSans display typography, a custom Canvas particle system with mouse magnetism, Framer Motion spring-physics card hover effects, and staggered entrance animations -- all without accent colors.

---

## Proposed Solution

### Architecture Migration

| Aspect | Current | Target |
|--------|---------|--------|
| Router | Pages Router (`/pages`) | App Router (`/app`) |
| Language | JavaScript | TypeScript |
| Styling | Tailwind 3.1.4 + Flowbite | Tailwind 3.3+ (no Flowbite) |
| Fonts | System defaults | CalSans (display) + Inter (body) |
| Animations | None | Custom CSS keyframes + Framer Motion |
| Effects | None | Canvas particle system, card glow |
| Content | Hardcoded in components | Structured data files (or MDX) |
| Curl Detection | `getServerSideProps` + `execSync` | Middleware rewrite + Route Handler |
| Theme | Light/Dark toggle | Dark-only (chronark style) |
| Icons | react-icons | Lucide React |
| Package Manager | npm | pnpm |

### Curl-Friendly Mode: Feasibility & Approach

**Feasibility: Fully feasible.** The App Router actually provides a *cleaner* implementation path:

**Current approach (Pages Router):**
```
Request → getServerSideProps → check User-Agent → execSync(card.sh) → write plain text
```

**New approach (App Router):**
```
Request → middleware.ts → detect curl User-Agent → rewrite to /api/curl
                                                  → route.ts → execSync(card.sh) → Response(text/plain)
       → if browser → render normal App Router pages
```

**Implementation:**

1. **`middleware.ts`** at project root:
   - Intercepts all requests to `/`
   - Checks `User-Agent` header for "curl" (only curl is supported; wget/httpie will receive browser HTML -- matches current behavior)
   - If curl: rewrites request to `/api/curl`
   - If browser/crawler: passes through to normal rendering (Googlebot receives server-rendered HTML with SEO content)

2. **`app/api/curl/route.ts`** (Route Handler):
   - **Must declare `export const runtime = 'nodejs'`** -- `execSync` requires Node.js APIs and will crash on Edge runtime
   - Sets `SCRIPT_DIR` environment variable dynamically for shell scripts (see Critical Fix below)
   - Executes existing bash scripts via `execSync` with timeout guard (5s max)
   - Returns `new Response(output, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })`
   - **Security constraint:** NEVER interpolate request data into shell commands

3. **Critical Fix -- Shell Script Path Resolution:**

   All shell scripts currently hardcode `SCRIPT_DIR="/var/task/public/curl"` (Vercel serverless path). This breaks local development. Fix:

   ```bash
   # In every shell script, replace:
   SCRIPT_DIR="/var/task/public/curl"
   # With:
   SCRIPT_DIR="${SCRIPT_DIR:-/var/task/public/curl}"
   ```

   Then in `route.ts`:
   ```typescript
   export const runtime = 'nodejs';

   import { execSync } from 'child_process';
   import path from 'path';

   export async function GET() {
     const cwd = process.cwd();
     const output = execSync('bash card.sh', {
       cwd,
       env: { ...process.env, SCRIPT_DIR: path.join(cwd, 'public/curl') },
       encoding: 'utf-8',
       timeout: 5000,
     });
     return new Response(output, {
       headers: { 'Content-Type': 'text/plain; charset=utf-8' },
     });
   }
   ```

4. **Vercel Deployment -- `vercel.json` for App Router:**

   The current `vercel.json` bundles shell scripts for Pages Router. For App Router:
   ```json
   {
     "functions": {
       "app/api/curl/route.ts": {
         "includeFiles": "card.sh,public/curl/**"
       }
     }
   }
   ```

This separation of concerns is cleaner than the current `getServerSideProps` approach.

---

## Technical Approach

### Page Structure

```
app/
├── layout.tsx              # Root layout: Inter + CalSans fonts, metadata, analytics
├── page.tsx                # Homepage: particles, name, tagline, nav links
├── globals.css             # Tailwind directives + custom animations
├── components/
│   ├── particles.tsx       # Canvas particle system with mouse magnetism
│   ├── card.tsx            # Framer Motion card with mouse-tracking glow
│   └── nav.tsx             # Scroll-aware sticky navigation
├── projects/
│   ├── layout.tsx          # Projects section layout
│   ├── page.tsx            # Projects listing grid
│   └── article.tsx         # Project card wrapper component
├── contact/
│   └── page.tsx            # Contact page with social cards
├── experience/
│   └── page.tsx            # Experience & education (new page, chronark doesn't have this)
└── api/
    └── curl/
        └── route.ts        # Curl-friendly plain text handler
middleware.ts               # Curl User-Agent detection & rewrite
```

### Content Data Structure

Instead of MDX/Contentlayer (to keep things simple and avoid a heavy dependency), use structured TypeScript data files:

```
data/
├── projects.ts             # Project entries with title, description, url, tech stack
├── experience.ts           # Work experience entries
├── education.ts            # Education entries
├── skills.ts               # Technical skills
└── socials.ts              # Social/contact links
```

This avoids the Contentlayer dependency (which has known issues with newer Next.js versions) while still decoupling content from components.

### Key Visual Components to Implement

#### 1. Particle System (`components/particles.tsx`)
- Custom HTML Canvas implementation (~200 lines)
- Configurable: quantity, staticity, ease, color
- Mouse magnetism via `useMousePosition` hook
- DPI-aware rendering for Retina displays
- `aria-hidden="true"` for accessibility
- **`prefers-reduced-motion` support:** Check `window.matchMedia('(prefers-reduced-motion: reduce)')` -- if true, do not render particles at all (return empty canvas or null)
- **Mobile optimization:** Reduce particle count on screens < 768px (use 30 instead of 100). On screens < 480px, use 15 particles. Throttle `requestAnimationFrame` on low-power hint if available.
- **Source reference:** `chronark.com/app/components/particles.tsx`

#### 2. Interactive Card (`components/card.tsx`)
- Framer Motion `useMotionValue` + `useSpring` for cursor tracking
- Radial gradient mask spotlight (240px radius)
- Spring physics: `stiffness: 500, damping: 100`
- Layered opacity transitions on hover
- **Touch device fallback:** On touch devices (detected via `@media (pointer: coarse)`), disable mouse-tracking glow. Show a subtle CSS `:active` opacity change on tap instead. Cards remain visually bordered rectangles on mobile.
- **`prefers-reduced-motion`:** Use Framer Motion's `useReducedMotion` hook to skip spring animations
- **Source reference:** `chronark.com/app/components/card.tsx`

#### 3. Navigation (`components/nav.tsx`)
- IntersectionObserver-based scroll detection
- Transparent at top, blurred background when scrolled
- Minimal: just "Projects", "Contact" (+ "Experience") links
- **Source reference:** `chronark.com/app/components/nav.tsx`

#### 4. Custom CSS Animations
| Animation | Effect |
|-----------|--------|
| `animate-title` | Line-height 0%→100%, letter-spacing compress, fade in (3s) |
| `animate-fade-in` | Opacity fade with delayed start |
| `animate-fade-left` | translateX(100%) → 0 with fade (used on glow dividers) |
| `animate-fade-right` | translateX(-100%) → 0 with fade (used on glow dividers) |

> **Note:** The decorative horizontal dividers use `animate-fade-left` / `animate-fade-right` combined with gradient backgrounds for the glow effect -- there is no separate `glow` keyframe in the chronark reference.

All CSS animations should respect `prefers-reduced-motion` via:
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; }
}
```

---

## Implementation Phases

### Phase 1: Foundation & Scaffolding
**Branch:** `feature/core-migration`

**Tasks:**
- [ ] Create `feature/core-migration` branch from `master`
- [ ] **FIRST: Remove/rename old Pages Router files** to avoid route conflicts (Next.js cannot have both `pages/index.js` and `app/page.tsx` for `/`):
  - Rename `pages/index.js` → `pages/index.js.bak`
  - Rename `pages/_app.js` → `pages/_app.js.bak`
- [ ] Remove the Jekyll GitHub Actions workflow (`.github/workflows/jekyll-gh-pages.yml`) -- deployment is via Vercel, not GitHub Pages
- [ ] Initialize App Router structure (`app/` directory)
- [ ] Add TypeScript configuration (`tsconfig.json`)
- [ ] Update `package.json`:
  - Add: `typescript`, `framer-motion`, `lucide-react`, `@types/node`, `@types/react`, `@types/react-dom`
  - Remove: `flowbite`, `react-router-dom`, `react-icons`
  - Move `vercel` from dependencies to devDependencies
  - Add `"packageManager": "pnpm@9.x"` field
  - **Lock Next.js to `14.2.x`** (not ^15.x -- chronark reference uses `@next/font` imports that changed in 15)
- [ ] Switch to pnpm: run `pnpm import` to convert `package-lock.json` → `pnpm-lock.yaml`, then delete `package-lock.json`
- [ ] Configure Tailwind for new design (custom animations, CalSans font family, Inter font family, dark palette with zinc grays)
- [ ] Add CalSans font file to `public/fonts/CalSans-SemiBold.ttf` (copy from `chronark.com/public/CalSans-SemiBold.ttf`)
- [ ] **Fix shell scripts for portable `SCRIPT_DIR`:** In all scripts under `public/curl/`, replace hardcoded path with `SCRIPT_DIR="${SCRIPT_DIR:-/var/task/public/curl}"`
- [ ] Set up `middleware.ts` for curl User-Agent detection and rewrite to `/api/curl`
- [ ] Create `app/api/curl/route.ts` with `export const runtime = 'nodejs'` and dynamic `SCRIPT_DIR` env
- [ ] Update `vercel.json` for App Router function config with `includeFiles: "card.sh,public/curl/**"`
- [ ] Verify curl mode works locally: `curl localhost:3000` returns terminal output
- [ ] Create `app/layout.tsx` with `next/font/local` (CalSans) and `next/font/google` (Inter), both using `display: 'swap'`, metadata, and base dark structure
- [ ] Create `app/globals.css` with Tailwind directives, custom keyframes (`title`, `fade-in`, `fade-left`, `fade-right`), and `prefers-reduced-motion` media query
- [ ] Create minimal `app/page.tsx` placeholder to verify build

**Success criteria:** Project builds with `pnpm build`, curl mode works locally and returns identical terminal output, base layout renders in browser with correct fonts

### Phase 2: Core Visual Components
**Tasks:**
- [ ] Implement `util/mouse.ts` (`useMousePosition` hook)
- [ ] Implement `app/components/particles.tsx` (Canvas particle system with `prefers-reduced-motion` check and mobile particle count reduction)
- [ ] Implement `app/components/card.tsx` (Framer Motion interactive card with touch device fallback)
- [ ] Implement `app/components/nav.tsx` (scroll-aware sticky navigation with IntersectionObserver)
- [ ] Create and populate data files with content migrated from current components:
  - `data/projects.ts` -- actual projects with title, description, url, repository (user will need to provide project data since current site only has skills)
  - `data/experience.ts` -- Grepsr (Service Delivery Engineer, May 2022-Present), Xelwel (Backend Developer, Nov 2021-May 2022)
  - `data/education.ts` -- ACME (Computer Engineering), Codetantra (Python), Prerana (+2 Science)
  - `data/skills.ts` -- TypeScript, FastAPI, PHP, Laravel, React.js, Django, MySQL, Python
  - `data/socials.ts` -- LinkedIn, Email (pramod.phuyal@outlook.com), GitHub, Resume link

**Success criteria:** All reusable components render correctly in isolation; data files compile with no TypeScript errors

### Phase 3: Page Implementation
**Tasks:**
- [ ] Build homepage (`app/page.tsx`):
  - Full-viewport centered layout on black background
  - Particles component behind all content
  - "PRAMOD PHUYAL" in CalSans with `animate-title` effect (text-4xl mobile → text-9xl desktop)
  - Horizontal gradient glow dividers with `animate-fade-left`/`animate-fade-right` (hidden on mobile)
  - Tagline: customized subtitle about current role/focus
  - Navigation links: "Projects", "Experience", "Contact" in zinc-500 with hover to zinc-300
  - Page is a Server Component (static title/links in initial HTML for SEO); Particles is a `"use client"` child
- [ ] Build projects page (`app/projects/page.tsx`):
  - Navigation component at top
  - Featured project card (full-width) + grid of remaining projects (3 columns desktop, 1 column mobile)
  - Each card uses the interactive Card component with hover glow
  - Project cards link to external URL or GitHub repo (open in new tab) -- no individual `/projects/[slug]` pages in MVP
  - Create `app/projects/article.tsx` wrapper for consistent card styling
  - Create `app/projects/layout.tsx` with gradient background
- [ ] Build contact page (`app/contact/page.tsx`):
  - Three cards in responsive grid (1 col mobile, 3 col desktop)
  - Email (pramod.phuyal@outlook.com), GitHub (iampramodphuyal), LinkedIn (pramod-phuyal)
  - Each card: circular icon container, handle/address in white, label in muted gray, hover color transitions
  - Resume download link included (either as 4th card or within existing cards)
- [ ] Build experience page (`app/experience/page.tsx`):
  - **Design spec (not in chronark, custom page):**
  - Vertical timeline layout with left-aligned dates and right-aligned content cards
  - Two sections: "Experience" and "Education", visually separated by a heading
  - Each entry: company/school name (CalSans heading), role/program, date range, brief description
  - Company logos displayed as small rounded images (reuse existing images from `public/images/`)
  - Uses the same Card component for visual consistency
  - Navigation component at top (same as projects page)

**Success criteria:** All pages render correctly, navigation works between all pages, homepage SEO content visible in view-source

### Phase 4: Polish & Migration Cleanup
**Tasks:**
- [ ] Add responsive design breakpoints across all pages (320px, 768px, 1024px, 1920px)
- [ ] Add `<head>` metadata and Open Graph tags in `app/layout.tsx` (title, description, og:image -- create a static `public/og.png`)
- [ ] Add `app/sitemap.ts` for automatic sitemap generation
- [ ] Test curl mode end-to-end: `pnpm build && pnpm start`, then `curl localhost:3000`
- [ ] Delete backup files: `pages/index.js.bak`, `pages/_app.js.bak`
- [ ] Delete old directories: `components/` (old JS components), `styles/`, `assets/`
- [ ] Ensure `public/robots.txt` is present
- [ ] Cross-browser testing (Chrome, Firefox, Safari)
- [ ] Mobile responsiveness testing (iOS Safari, Android Chrome)
- [ ] Performance audit (Lighthouse score > 90)
- [ ] Verify `prefers-reduced-motion` works across all pages
- [ ] Final `pnpm build` with zero errors and zero warnings

**Success criteria:** Production-ready, both curl and browser modes working, clean codebase with no legacy files, Lighthouse > 90

---

## Alternative Approaches Considered

### 1. Fork chronark.com directly and modify
**Rejected:** While faster initially, this creates maintenance debt. The chronark.com repo has Contentlayer (which has compatibility issues with newer Next.js), Upstash Redis (unnecessary), and content structures that don't match this portfolio's needs. Building fresh with chronark as a visual reference is cleaner.

### 2. Keep Pages Router, just restyle
**Rejected:** The Pages Router is effectively legacy in Next.js. Migrating to App Router provides React Server Components, better data fetching patterns, nested layouts, and middleware -- all of which benefit the curl detection architecture.

### 3. Use Contentlayer for MDX content
**Rejected for now:** Contentlayer has been effectively abandoned (last meaningful update was 2023) and has known issues with Next.js 14+. Simple TypeScript data files achieve the same decoupling without the dependency risk. MDX can be added later if needed.

### 4. Dark/Light theme toggle (like current portfolio)
**Rejected:** The chronark.com aesthetic is fundamentally dark. The particle system, glow effects, and gradient text all rely on a dark background. Adding a light mode would require a parallel design system with diminishing returns.

---

## Acceptance Criteria

### Functional Requirements
- [ ] Homepage displays with particle background, animated title "PRAMOD PHUYAL", tagline, and navigation links
- [ ] Projects page shows project cards in a responsive grid with mouse-tracking hover glow
- [ ] Contact page shows Email, GitHub, and LinkedIn cards with icons
- [ ] Experience page shows work history and education
- [ ] Navigation between all pages works correctly
- [ ] `curl localhost:3000` (and `curl <deployed-url>`) returns ANSI-colored terminal portfolio output identical to current
- [ ] All existing shell scripts execute correctly in the new architecture

### Non-Functional Requirements
- [ ] TypeScript strict mode enabled with no type errors
- [ ] Lighthouse performance score > 90
- [ ] Mobile responsive (works on 320px+ viewport widths)
- [ ] First Contentful Paint < 1.5s
- [ ] Particle system runs at 60fps on modern hardware
- [ ] No layout shift (CLS < 0.1)

### Quality Gates
- [ ] `pnpm build` completes without errors
- [ ] All pages accessible via keyboard navigation
- [ ] No WCAG 2.1 AA violations (except particle background, which is decorative)

---

## Dependencies & Prerequisites

| Dependency | Purpose | Version |
|------------|---------|---------|
| next | Framework | 14.2.x (pinned -- do NOT use 15.x due to breaking changes in font imports and caching) |
| react / react-dom | UI library | ^18.2.0 |
| typescript | Type safety | ^5.x |
| tailwindcss | Styling | ^3.4.x |
| framer-motion | Card hover animations | ^11.x |
| lucide-react | Icons | ^0.300.x |
| @types/node | Type definitions | ^20.x |
| @types/react, @types/react-dom | Type definitions | ^18.x |
| postcss, autoprefixer | CSS processing | latest |

**Dependencies to REMOVE:** `flowbite`, `react-router-dom`, `react-icons`
**Dependencies to move to devDependencies:** `vercel`

**No external services required** -- view counters (Upstash Redis) are optional and excluded from MVP.

---

## Risk Analysis & Mitigation

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Shell scripts not bundled in Vercel serverless | **Critical** | Medium | Explicit `vercel.json` `includeFiles` config for App Router route handler; test with `vercel build` locally |
| Shell script `SCRIPT_DIR` path breaks locally | **Critical** | High | Fix all scripts to use `${SCRIPT_DIR:-/var/task/public/curl}` pattern before any other work |
| Route conflict between `pages/` and `app/` | **Critical** | High | Remove/rename Pages Router files as very first task in Phase 1 |
| `execSync` fails on Edge runtime | High | Medium | Explicitly set `export const runtime = 'nodejs'` in route handler |
| Particle system performance on mobile | Medium | Medium | Reduce particle count (100 → 30 on tablet, 15 on phone); respect `prefers-reduced-motion` |
| CalSans font FOUT during title animation | Medium | Medium | Use `next/font/local` with `display: 'swap'` and `sans-serif` fallback; title animation starts after hydration |
| Vercel serverless cold start for curl | Low | Low | Shell scripts execute in <1s; `execSync` timeout set to 5s |
| pnpm detection by Vercel | Low | Low | Add `"packageManager": "pnpm@9.x"` to `package.json` |
| Shell injection via request data | Low | Low | Route handler NEVER interpolates request data into shell commands (constraint documented) |

---

## File-by-File Implementation Reference

### New Files to Create

| File | Purpose | Reference |
|------|---------|-----------|
| `app/layout.tsx` | Root layout with fonts and metadata | `chronark.com/app/layout.tsx` |
| `app/page.tsx` | Homepage with particles and title | `chronark.com/app/page.tsx` |
| `app/globals.css` | Tailwind + custom animations | `chronark.com/app/globals.css` |
| `app/components/particles.tsx` | Canvas particle system | `chronark.com/app/components/particles.tsx` |
| `app/components/card.tsx` | Interactive hover card | `chronark.com/app/components/card.tsx` |
| `app/components/nav.tsx` | Scroll-aware navigation | `chronark.com/app/components/nav.tsx` |
| `app/projects/page.tsx` | Projects listing | `chronark.com/app/projects/page.tsx` |
| `app/projects/layout.tsx` | Projects layout | `chronark.com/app/projects/layout.tsx` |
| `app/projects/article.tsx` | Project card wrapper | `chronark.com/app/projects/article.tsx` |
| `app/contact/page.tsx` | Contact page | `chronark.com/app/contact/page.tsx` |
| `app/experience/page.tsx` | Experience & education (new) | N/A (custom page) |
| `app/api/curl/route.ts` | Curl mode handler | New (replaces getServerSideProps logic) |
| `middleware.ts` | Curl User-Agent detection | New |
| `data/projects.ts` | Project data | New |
| `data/experience.ts` | Experience data | New |
| `data/education.ts` | Education data | New |
| `data/skills.ts` | Skills data | New |
| `data/socials.ts` | Social links | New |
| `util/mouse.ts` | Mouse position hook | `chronark.com/util/mouse.ts` |
| `tsconfig.json` | TypeScript config | Standard Next.js TypeScript config |
| `next.config.mjs` | Next.js config | Minimal config |

### Files to Keep (Modified)
| File | Change |
|------|--------|
| `card.sh` | Update `SCRIPT_DIR` to use env variable fallback |
| `public/curl/*.sh` | Update `SCRIPT_DIR` to use env variable fallback in each script |
| `public/images/*` | Keep as-is (profile pictures, company logos) |
| `public/favicon*` | Keep as-is |
| `public/robots.txt` | Keep as-is |
| `vercel.json` | **Rewrite** for App Router function config |

### Files to Remove (Phase 1: rename; Phase 4: delete)
| File | Reason |
|------|--------|
| `pages/index.js` | Replaced by `app/page.tsx` -- **rename in Phase 1, delete in Phase 4** |
| `pages/_app.js` | Replaced by `app/layout.tsx` -- **rename in Phase 1, delete in Phase 4** |
| `components/*.js` | Replaced by new TypeScript components in `app/components/` |
| `styles/globals.css` | Replaced by `app/globals.css` |
| `assets/styles.css` | Unused legacy file |
| `.github/workflows/jekyll-gh-pages.yml` | Jekyll workflow irrelevant to Next.js/Vercel deployment |
| `package-lock.json` | Replaced by `pnpm-lock.yaml` |

---

## Content Migration Map

### Personal Info
| Field | Source | Destination |
|-------|--------|-------------|
| Name | `Cards.js` + `config.sh` | `app/page.tsx` (title) + `data/socials.ts` |
| Title | `Cards.js` "Software Engineer" | `app/page.tsx` (subtitle) |
| Bio | `Cards.js` | `app/page.tsx` (description) |
| Resume | `Cards.js` Google Drive link | `data/socials.ts` or contact page |

### Projects
| Current | New Location |
|---------|-------------|
| Skills section (8 skill cards) | `data/projects.ts` (reframe as actual projects) |

### Experience
| Current | New Location |
|---------|-------------|
| `Experience.js` (Grepsr, Xelwel) | `data/experience.ts` |
| `Education.js` (ACME, Codetantra, Prerana) | `data/education.ts` |

### Contact
| Current | New Location |
|---------|-------------|
| `ContactMe.js` (LinkedIn, Gmail, GitHub) | `data/socials.ts` + `app/contact/page.tsx` |

---

## References & Research

### Internal References
- Current portfolio: `/Users/pramodphuyal/Documents/projects/portfolio/portfolio/`
- chronark.com source: `/Users/pramodphuyal/Documents/projects/portfolio/chronark.com/`
- Curl detection logic: `portfolio/pages/index.js:60-78`
- Shell scripts: `portfolio/public/curl/*.sh`
- Current Tailwind config: `portfolio/tailwind.config.js`

### External References
- chronark.com GitHub: https://github.com/chronark/chronark.com
- Next.js App Router docs: https://nextjs.org/docs/app
- Next.js Middleware: https://nextjs.org/docs/app/building-your-application/routing/middleware
- Next.js Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- Framer Motion: https://www.framer.com/motion/
- CalSans font: Available in chronark.com repo at `public/CalSans-SemiBold.ttf`
- Tailwind CSS: https://tailwindcss.com/docs

---

## Design Decisions Log

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Next.js version | 14.2.x | chronark reference uses old `@next/font` imports; Next.js 15 has breaking changes |
| Content management | TypeScript data files | Contentlayer is abandoned; TS data files are simpler and type-safe |
| Theme | Dark-only | Particle system and glow effects depend on dark background |
| CLI tool support | curl only | Matches current behavior; wget/httpie get browser HTML |
| Package manager | pnpm | Faster installs, stricter dependency resolution, matches chronark reference |
| Contact form | Dropped | Replaced by direct social link cards (chronark pattern) |
| Individual project pages | Not in MVP | Project cards link to external URLs; `[slug]` pages can be added later |
| View counters | Not in MVP | Requires Upstash Redis; can be added as a follow-up |
| Font display strategy | `swap` | Prevents invisible text; minor FOUT is acceptable |
