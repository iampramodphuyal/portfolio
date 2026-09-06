#!/usr/bin/env bash

SCRIPT_DIR="${SCRIPT_DIR:-/var/task/public/curl}"

source "$SCRIPT_DIR/config.sh"
source "$SCRIPT_DIR/box.sh"

# horizontalLayout.sh resets color (\033[0m) before every right-column row,
# then relies on that row's own text to carry its own color code. Fine for a
# single-line value, but fold() below can turn one value into several
# physical lines, and only the first one had a leading color code — every
# line after it rendered in the terminal's default color instead. Re-stamp
# the color onto every line so each one survives that per-row reset.
colorize_lines() {
  sed "s/^/$1/"
}

# VISITOR_LOCATION (set per-request by app/api/curl/route.ts) personalizes
# the opening of CARD_BIO_L1 without duplicating its text here — falls back
# to the unmodified bio when unset (local runs, or location unavailable).
BIO_L1="$CARD_BIO_L1"
if [ -n "$VISITOR_LOCATION" ]; then
  BIO_L1="${CARD_BIO_L1/Hi, /Hi, visitor from ${VISITOR_LOCATION}, }"
fi

# The location clause can push this line past a typical terminal's width.
# We can't know the real width (no tty here — see footer.sh's own
# ${COLUMNS:-100} fallback), so pre-wrap at 62 chars — the width
# CARD_BIO_L2 already assumes unwrapped (it renders on one line in every
# terminal we've tested), making it the empirically-safe width for this
# info column rather than a stricter theoretical budget the card never
# actually met. Wrapping ourselves keeps any overflow inside the info
# column (createHorizontalLayout blank-pads the art column beneath it)
# instead of letting the terminal force-wrap it under the ASCII art.
BIO_L1=$(printf '%s' "$BIO_L1" | fold -s -w 62 | colorize_lines "$C_YELLOW")

# VISITOR_STAT (same time/weather/witty content as the browser greeting
# widget, composed server-side) rides along in this same info section
# rather than a separate greeting block. Empty when there's nothing to
# show (no resolved timezone) — prints nothing extra in that case.
STAT_LINE=""
if [ -n "$VISITOR_STAT" ]; then
  STAT_LINE=$(printf '%s' "$VISITOR_STAT" | fold -s -w 62 | colorize_lines "$C_GRAY")
fi

sourceCode="${C_CYAN}[SOURCE CODE] ${C_GREEN}${S_UNDERLINE}${CARD_REPO}${C_DEFAULT}"
echo -e "\n\n${C_MAGENTA}${S_BOLD}${CARD_NAME}${C_DEFAULT}
${C_CYAN}${CARD_TITLE}${C_DEFAULT}
\n${BIO_L1}
${C_YELLOW}${CARD_BIO_L2}${C_DEFAULT}"

if [ -n "$STAT_LINE" ]; then
  echo -e "\n${STAT_LINE}${C_DEFAULT}"
fi

# VISITOR_SAMPLE (set when resolveGeo() had no real headers to read, i.e.
# local `next dev`) marks the location/time/weather above as sample data —
# mirrors the browser greeting widget's own disclosure, so `curl localhost`
# doesn't read as a wrong real location.
if [ -n "$VISITOR_SAMPLE" ]; then
  echo -e "${C_GRAY}(local dev only — location/time/weather above are sample data)${C_DEFAULT}"
fi

echo -e "\n\n$sourceCode"
