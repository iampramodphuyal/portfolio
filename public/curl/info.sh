#!/usr/bin/env bash


SCRIPT_DIR="${SCRIPT_DIR:-/var/task/public/curl}"

source "$SCRIPT_DIR/config.sh"
source "$SCRIPT_DIR/box.sh"


sourceCode="${C_CYAN}[SOURCE CODE] ${C_GREEN}${S_UNDERLINE}${CARD_REPO}${C_DEFAULT}"
echo -e "\n\n${C_MAGENTA}${S_BOLD}${CARD_NAME}${C_DEFAULT}
${C_CYAN}${CARD_TITLE}${C_DEFAULT}
\n${C_YELLOW}${CARD_BIO_L1}
${C_YELLOW}${CARD_BIO_L2}${C_DEFAULT}"

echo -e "\n\n$sourceCode"
