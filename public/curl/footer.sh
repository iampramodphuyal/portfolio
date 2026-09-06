#!/usr/bin/env bash


line="─────────────────────────────"

# cols=$(tput cols) # this is for dynamic terminal width generation

cols=${COLUMNS:-100}

padding=$(( (cols - ${#line}) / 2 ))
# padding=$(( (cols + ${#line} ) / 2 ))
# printf "\n\n\n\t\t${C_MAGENTA}%*s%s${C_DEFAULT}\n" $padding "" "$line"

# Read version from package.json
PKG_JSON="${SCRIPT_DIR}/../../package.json"
PKG_VERSION=$(sed -n 's/.*"version": *"\([^"]*\)".*/\1/p' "$PKG_JSON" 2>/dev/null || echo "0.0.0")
CURRENT_YEAR=$(date +%Y)
LAST_UPDATED=$(date +"%b %Y")

footer="[NOTE] Minimal. Efficient. Terminal-inspired."
copyrights="© ${CURRENT_YEAR} Pramod Phuyal | Last updated: ${LAST_UPDATED} | v${PKG_VERSION}"
footerPadding=$(( (cols - ${#footer}) / 2 ))
copyrightsPadding=$(( (cols - ${#copyrights}) / 2 ))
# padding=$(( (cols ) / 2 ))
printf "\t\t${C_CYAN}%*s%s${C_DEFAULT}\n" $footerPadding "" "$footer"
printf "\t\t${C_GRAY}%*s%s${C_DEFAULT}\n" $copyrightsPadding "" "$copyrights"

