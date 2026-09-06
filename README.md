# pramodphuyal.com.np

[![CI](https://github.com/iampramodphuyal/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/iampramodphuyal/portfolio/actions/workflows/ci.yml)

Personal portfolio with a twist: every page is served twice. Browsers get a
Next.js site; terminals get ANSI.

```
$ curl https://pramodphuyal.com.np
```

renders an ASCII business card — and `/projects`, `/experience`, `/blog`, and
`/contact` all have terminal counterparts.

## How the dual-mode delivery works

```
request
  └─ middleware.ts — User-Agent contains "curl"?
       ├─ no  → normal App Router pages
       └─ yes → rewrite via util/curl-routes.ts (CURL_REWRITES table)
            ├─ /            → app/api/curl/route.ts        (bash: card.sh + public/curl/*.sh)
            ├─ /projects…   → app/api/curl/*/route.ts      (TypeScript, ANSI escapes)
            └─ anything else → plain-text 404 ("command not found")
```

- **One route table.** `util/curl-routes.ts` feeds the middleware, the
  on-page curl banner (which hides on pages without a terminal counterpart),
  and a parity test that fails CI if a page ships without a curl handler.
- **One content source.** Everything comes from `data/*.ts`.
  `scripts/generate-curl-config.ts` regenerates `public/curl/config.sh`
  (single-quote-escaped — bash sources it inside the request path) before
  every dev/build/test run, so the bash card can't drift from the site.
- **Deliberately curl-only.** The UA check is a case-sensitive substring:
  wget/HTTPie get HTML, libcurl-based clients get ANSI. No Accept-header
  negotiation — it's a business card, not an API.

## Stack

Next.js 14 (App Router) · TypeScript · Tailwind CSS · Framer Motion ·
bash for the homepage card · `node:test` smoke tests · GitHub Actions ·
deployed on Vercel.

## Local development

```bash
pnpm install
pnpm dev          # generates public/curl/config.sh, then next dev

# browser: http://localhost:3000
# terminal:
curl -A curl http://localhost:3000/
curl -A curl http://localhost:3000/projects
```

`bash` is required (the homepage card shells out to `card.sh`). Running
`card.sh` standalone needs the generated config first:
`pnpm tsx scripts/generate-curl-config.ts`.

```bash
pnpm lint         # eslint (next/core-web-vitals)
pnpm test         # curl handler smoke tests + route parity
pnpm build        # type gate + production build
```

## Design

Visual design inspired by [chronark.com](https://chronark.com) —
reimplemented from scratch, with the terminal delivery layered on top.
