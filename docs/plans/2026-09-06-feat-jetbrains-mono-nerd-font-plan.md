---
title: "feat: JetBrains Mono Nerd Font everywhere — one font, zero component edits"
type: feat
status: draft
date: 2026-09-06
---

# feat: JetBrains Mono Nerd Font everywhere

Replace Inter (body) + CalSans (display) with a single self-hosted **JetBrains Mono Nerd Font**.
Source files are already installed at `~/Library/Fonts/JetBrainsMonoNerdFont-*.ttf` — no download needed.

## The dedupe

Tailwind preflight (verified in `node_modules/tailwindcss/lib/css/preflight.css:36,115`) sets
`html { font-family: theme('fontFamily.sans') }` and `code/pre { theme('fontFamily.mono') }`.

So pointing **`sans`, `mono`, and `display` at the same CSS variable** covers the whole site.
The 14 `font-display` usages and 3 `font-mono` usages keep working untouched — **no component edits at all**.
Two files change: `app/layout.tsx` and `tailwind.config.js`.

## Decision gate — subset scope (pick one before step 1)

Repo has **zero Nerd/PUA glyphs** today (`grep -rlP '[\x{e000}-\x{f8ff}\x{f0000}-\x{ffffd}]' app data scripts` → no hits).

| Option | Size/weight | Consequence |
|---|---|---|
| **A. Latin-only** (recommended) | 29 KB woff2 (measured) | Renders identically to plain JetBrains Mono. Icon glyphs dropped. |
| **B. Latin + PUA** | 903 KB woff2 (measured) | Nerd icons available for terminal flourishes (curl banner, `not-found`). |

Take **A** now; the subset command in step 1 upgrades to B by appending one unicode range. Default to A if unanswered.

## Steps

### 1. Subset + convert to woff2

`next/font/local` does **not** subset — it ships whatever you hand it, and the raw TTFs are 2.4 MB each.
No woff2 tooling installed; `uv` is, so run it disposably:

```sh
cd portfolio
mkdir -p app/fonts
LATIN='U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD'
# Option B: LATIN="$LATIN,U+E000-F8FF,U+F0000-FFFFD"
for W in Regular Bold; do
  uvx --from 'fonttools[woff]' pyftsubset \
    ~/Library/Fonts/JetBrainsMonoNerdFont-$W.ttf \
    --unicodes="$LATIN" --flavor=woff2 \
    --output-file=app/fonts/JetBrainsMonoNerdFont-$W.woff2
done
ls -lh app/fonts   # verified: 29KB (option A) / 903KB (option B) per weight
```

Nerd Fonts ships static instances only (no variable font), hence one file per weight.
Weight classes in use are exactly `font-bold` (12) and `font-medium` (9) — nothing else. Ship **400 + 700**; `font-medium` falls back to 400, add `Medium` only if it reads too light after step 5.
For option B use the `JetBrainsMonoNerdFontMono-*` source instead, so icons stay single-cell; for option A the variants are byte-identical over Latin.

### 2. `app/layout.tsx`

Delete the `Inter` and `LocalFont` CalSans blocks and both imports; replace with:

```ts
import LocalFont from "next/font/local";

const jetbrains = LocalFont({
  src: [
    { path: "./fonts/JetBrainsMonoNerdFont-Regular.woff2", weight: "400", style: "normal" },
    { path: "./fonts/JetBrainsMonoNerdFont-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-jetbrains",
  display: "swap",
});
```

`<html lang="en" className={jetbrains.variable}>` — drop the `[...].join(" ")`.

### 3. `tailwind.config.js`

```js
fontFamily: {
  sans: ["var(--font-jetbrains)", ...defaultTheme.fontFamily.mono],
  mono: ["var(--font-jetbrains)", ...defaultTheme.fontFamily.mono],
  display: ["var(--font-jetbrains)"],
},
```

Fallback stack is the **mono** stack in all three slots. Note this only bites on total load failure: `next/font/local` defaults to `adjustFontFallback: 'Arial'` and injects a size-adjusted `__jetbrains_Fallback` face ahead of your stack, so that — not the mono list — is what renders during swap. That's the CLS feature working; keep it.

### 4. Delete `public/fonts/CalSans-SemiBold.ttf`

Directory becomes empty; remove it too. Fonts now live in `app/fonts/` and are served hashed from `_next/static` by `next/font` — `public/` would expose a second uncached copy.

### 5. Visual check (the one real risk)

`app/page.tsx:35` — `md:text-9xl whitespace-nowrap font-display`. "PRAMOD PHUYAL" is 13 chars; monospace at 128px ≈ 0.6em advance ≈ **1000px wide**, wider than CalSans was. Expect horizontal overflow at the `md` breakpoint.

Run `pnpm dev`, screenshot `/` at 768px and 1440px. Fix by stepping the clamp down (`md:text-7xl`) or dropping `whitespace-nowrap` — pick after seeing it, don't guess the value now.

## Out of scope (deliberate)

- **`app/opengraph-image.tsx`** — `fontFamily: "monospace"` is already a no-op: satori resolves no generic families without a font buffer, and it can't read woff2. Making the OG card match means keeping a subsetted **TTF** and passing `fonts: [...]` to `ImageResponse`. Skipped; open a follow-up if the OG card matters.
- **curl / shell output** (`public/curl/*.sh`, handlers) — plain text, rendered in the visitor's own terminal font.
- **`docs/plans/*`** — historical records, CalSans references stay accurate for their date.

## Acceptance

```sh
grep -rn "font-inter\|next/font/google\|CalSans\|calsans" app tailwind.config.js   # → no matches
pnpm typecheck && pnpm build                          # → passes
ls public/fonts                                       # → gone
```

Plus step 5's screenshot showing no horizontal overflow on `/`.
