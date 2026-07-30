---
title: "feat: Unified Config-Based Content Delivery (Browser + Curl)"
type: feat
status: active
date: 2026-02-17
---

# feat: Unified Config-Based Content Delivery (Browser + Curl)

## Overview

Establish TypeScript data files as the single source of truth for all portfolio content, and serve every route in two formats: HTML/JS for browsers and styled plain text for curl/terminal clients. Currently only `/` has curl support (via shell scripts that duplicate data from TS files). This feature expands curl support to all routes, eliminates content duplication, and creates shared formatting utilities.

## Problem Statement / Motivation

Content is currently maintained in **three separate places** that easily drift out of sync:

| Content | Browser Source | Curl Source |
|---------|---------------|-------------|
| Name, title | `app/page.tsx`, `app/layout.tsx` | `public/curl/config.sh` (says "Software Developer" vs "Software Engineer") |
| Socials | `data/socials.ts` AND `app/contact/page.tsx` (duplicated!) | `public/curl/config.sh` |
| Projects | `data/projects.ts` | No curl support |
| Experience | `data/experience.ts` | No curl support |
| Blog | `data/blog.ts` | No curl support |
| Bio text | `app/page.tsx` | `public/curl/info.sh` (different wording) |

Additionally, only `curl pramodphuyal.com.np` works — running `curl pramodphuyal.com.np/projects` returns unreadable HTML. There's no way for terminal users to browse the portfolio beyond the business card.

## Proposed Solution

### Architecture

```
Request
  |
  v
middleware.ts (expanded matcher)
  |
  ├── User-Agent contains "curl"?
  |     └── Yes: rewrite /path → /api/curl/path
  |           |
  |           ├── /api/curl/route.ts          (existing shell scripts for homepage)
  |           ├── /api/curl/projects/route.ts  (TS: reads data/projects.ts)
  |           ├── /api/curl/blog/route.ts      (TS: reads data/blog.ts)
  |           ├── /api/curl/blog/[slug]/route.ts (TS: extracts plain text from blog content)
  |           ├── /api/curl/experience/route.ts  (TS: reads experience + education + certs)
  |           └── /api/curl/contact/route.ts     (TS: reads data/socials.ts)
  |
  └── No: NextResponse.next() → normal App Router pages (unchanged)
```

### Key Design Decisions

1. **Individual route handlers** (not a catch-all) — follows Next.js conventions, each handler is independently testable and deployable as its own Vercel serverless function
2. **Keep existing shell scripts** for homepage curl — they produce polished ANSI art that works well; generate `config.sh` from TS data at build time so they stay in sync
3. **New TypeScript handlers** for all other routes — clean terminal output using a shared `lib/curl-format.ts` utility module
4. **Add `plainText` field to `BlogPost` type** — rather than attempting to walk React.createElement trees (fragile, unmaintainable), blog posts provide an optional plain-text version of content for curl rendering
5. **Refactor `contact/page.tsx`** to import from `data/socials.ts` — fix the existing data duplication before building on it

## Technical Approach

### Phase 1: Fix Data Duplication (Prerequisites)

#### 1a. Refactor `contact/page.tsx` to use `data/socials.ts`

`app/contact/page.tsx:7-26` currently hardcodes a `socials` array with Lucide icon JSX. Refactor to import from `data/socials.ts` and map icon strings to components:

```typescript
// app/contact/page.tsx
import { socials } from "@/data/socials";
import { Github, Mail, Linkedin } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  linkedin: <Linkedin size={20} />,
  mail: <Mail size={20} />,
  github: <Github size={20} />,
};

// Then in JSX: iconMap[s.icon]
```

#### 1b. Add `plainText` field to `BlogPost` type

```typescript
// data/blog.ts
export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  published: boolean;
  tags?: string[];
  content: () => React.ReactElement;
  plainText?: string; // Terminal-friendly content for curl
};
```

Add `plainText` to the existing dotfiles blog post — a readable plain-text version of the same content without HTML/React markup.

#### 1c. Add `prebuild` script to generate `config.sh`

Create `scripts/generate-curl-config.ts` that reads from `data/socials.ts` and writes `public/curl/config.sh` with the `CARD_*` variables. Add to `package.json`:

```json
"prebuild": "tsx scripts/generate-curl-config.ts"
```

This keeps the homepage shell scripts working while ensuring they always reflect the TS data. The generated file should be `.gitignore`d.

### Phase 2: Shared Curl Formatting Utilities

Create `lib/curl-format.ts` with terminal formatting helpers:

```typescript
// lib/curl-format.ts

// ANSI color codes
export const colors = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  white: "\x1b[1;37m",
  cyan: "\x1b[36m",
  gray: "\x1b[90m",
  yellow: "\x1b[33m",
};

// Format a section header
export function header(text: string): string;

// Format a horizontal rule
export function divider(width?: number): string;

// Format a key-value pair with aligned columns
export function keyValue(key: string, value: string, keyWidth?: number): string;

// Wrap text to a target width (default 80)
export function wrap(text: string, width?: number): string;

// Format a table with aligned columns
export function table(rows: string[][], headers?: string[]): string;

// Navigation footer shown on every curl response
export function navFooter(): string;
// e.g.: "Try also: curl pramodphuyal.com.np/{projects,blog,experience,contact}"
```

### Phase 3: Expand Middleware

Update `middleware.ts` to handle all page routes:

```typescript
// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const CURL_ROUTES = ["/", "/projects", "/blog", "/experience", "/contact"];

export function middleware(request: NextRequest) {
  const userAgent = request.headers.get("user-agent") || "";
  const pathname = request.nextUrl.pathname;

  if (!userAgent.includes("curl")) {
    return NextResponse.next();
  }

  // Homepage: existing /api/curl handler
  if (pathname === "/") {
    return NextResponse.rewrite(new URL("/api/curl", request.url));
  }

  // Blog post detail: /blog/[slug]
  if (pathname.startsWith("/blog/") && pathname !== "/blog") {
    return NextResponse.rewrite(new URL(`/api/curl${pathname}`, request.url));
  }

  // Known routes
  if (CURL_ROUTES.includes(pathname)) {
    return NextResponse.rewrite(new URL(`/api/curl${pathname}`, request.url));
  }

  // Unknown route: let Next.js handle (will 404 naturally)
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next|images|fonts|favicon\\.ico|curl|public).*)"],
};
```

### Phase 4: Build Curl Route Handlers

Each handler reads from the corresponding data file, formats with `curl-format.ts`, and returns `text/plain`.

#### `/api/curl/projects/route.ts`
- Import `projects` from `@/data/projects`
- Filter `published: true`, sort by date descending
- Format as a list with title, description (truncated to ~76 chars), date, and URL
- Include nav footer

#### `/api/curl/blog/route.ts`
- Import `blogPosts` from `@/data/blog`
- Filter `published: true`, sort by date descending
- Format as a list with title, date, tags, and description
- Show `curl pramodphuyal.com.np/blog/<slug>` hint for each post

#### `/api/curl/blog/[slug]/route.ts`
- Import `blogPosts` from `@/data/blog`
- Find by slug, check `published: true`
- Render `post.plainText` if available, otherwise render title + description only
- Return 404 plain text for missing/unpublished slugs: `"Post not found.\n\nAvailable posts:\n..."`

#### `/api/curl/experience/route.ts`
- Import from `data/experience.ts`, `data/education.ts`, `data/certifications.ts`
- Three sections: WORK, EDUCATION, CERTIFICATIONS
- Each entry: company/institution, role/program, date range, description
- Format with `keyValue()` and section `header()`s

#### `/api/curl/contact/route.ts`
- Import `socials` from `@/data/socials`
- Format each entry: label, handle, URL
- Include nav footer

### Phase 5: Update Vercel Configuration

Update `vercel.json` to bundle shell scripts with the homepage handler:

```json
{
  "functions": {
    "app/api/curl/route.ts": {
      "includeFiles": "card.sh,public/curl/**"
    }
  }
}
```

New TypeScript handlers don't need `includeFiles` since they import TS data files (bundled by default).

## Acceptance Criteria

### Functional

- [ ] `curl pramodphuyal.com.np` returns the same ANSI business card as today (shell scripts)
- [ ] `curl pramodphuyal.com.np/projects` returns a formatted list of published projects
- [ ] `curl pramodphuyal.com.np/blog` returns a list of published blog posts with slugs
- [ ] `curl pramodphuyal.com.np/blog/dotfiles-cross-platform-setup` returns the full post as plain text
- [ ] `curl pramodphuyal.com.np/experience` returns work, education, and certifications
- [ ] `curl pramodphuyal.com.np/contact` returns social links and contact info
- [ ] `curl pramodphuyal.com.np/nonexistent` returns a terminal-friendly 404 (not HTML)
- [ ] Every curl response includes a navigation footer hinting at other available routes
- [ ] Browser access to all routes is completely unchanged
- [ ] `contact/page.tsx` imports from `data/socials.ts` (no inline data duplication)
- [ ] Shell script `config.sh` is generated from TS data at build time

### Non-Functional

- [ ] `pnpm build` succeeds with no errors
- [ ] All curl responses use `Content-Type: text/plain; charset=utf-8`
- [ ] Curl responses target 80-column width for universal terminal compatibility
- [ ] No new npm dependencies required (ANSI codes are just strings)

## Dependencies & Risks

| Risk | Mitigation |
|------|-----------|
| Shell script `config.sh` generation could go stale | `prebuild` script runs automatically; generated file in `.gitignore` |
| Blog posts without `plainText` field | Graceful fallback: show title + description + "Read the full post at [URL]" |
| Middleware matching too broadly (breaking static assets) | Negative lookahead excludes `api`, `_next`, `images`, `fonts`, `favicon.ico` |
| `curl` detection is User-Agent only | Acceptable for a portfolio site; could later add `Accept` header check |
| Future blog posts forget `plainText` | TypeScript type has `plainText?` as optional — won't break, just degrades gracefully |

## Files to Create

| File | Purpose |
|------|---------|
| `lib/curl-format.ts` | Shared ANSI formatting utilities |
| `scripts/generate-curl-config.ts` | Generates `config.sh` from TS data |
| `app/api/curl/projects/route.ts` | Curl handler for `/projects` |
| `app/api/curl/blog/route.ts` | Curl handler for `/blog` |
| `app/api/curl/blog/[slug]/route.ts` | Curl handler for `/blog/[slug]` |
| `app/api/curl/experience/route.ts` | Curl handler for `/experience` |
| `app/api/curl/contact/route.ts` | Curl handler for `/contact` |

## Files to Modify

| File | Change |
|------|--------|
| `data/blog.ts` | Add optional `plainText` field to `BlogPost` type; add plain text for dotfiles post |
| `app/contact/page.tsx` | Import from `data/socials.ts` instead of hardcoding inline |
| `middleware.ts` | Expand matcher to all routes; route-aware curl rewriting |
| `vercel.json` | Verify `includeFiles` for homepage handler (may not need changes) |
| `package.json` | Add `prebuild` script for config generation |

## References & Research

### Internal References
- Current curl handler: `app/api/curl/route.ts`
- Shell scripts: `card.sh`, `public/curl/config.sh`, `public/curl/*.sh`
- Data files: `data/projects.ts`, `data/experience.ts`, `data/education.ts`, `data/certifications.ts`, `data/socials.ts`, `data/blog.ts`
- Middleware: `middleware.ts:1-15`
- Contact page (duplicated data): `app/contact/page.tsx:7-26`
- Vercel config: `vercel.json`

### Related Plan
- `docs/plans/2026-02-17-feat-chronark-style-portfolio-migration-plan.md` — migration plan that documents the curl/middleware architecture
