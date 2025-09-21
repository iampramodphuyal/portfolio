#!/bin/bash


SCRIPT_DIR="var/task/public/curl"

source "$SCRIPT_DIR/config.sh"
source "$SCRIPT_DIR/box.sh"


sourceCode="${C_CYAN}[SOURCE CODE] ${C_GREEN}${S_UNDERLINE}https://github.com/iampramodphuyal/portfolio${C_DEFAULT}"
echo -e "\n\n${C_MAGENTA}${S_BOLD}${CARD_NAME}${C_DEFAULT}
${C_CYAN}${CARD_TITLE}${C_DEFAULT}
\n${C_YELLOW}Hi, I’m Pramod — Dev focused on Python, TS, and little-bit Bash.
${C_YELLOW}I enjoy creating minimal, efficient, and terminal-inspired tools${C_DEFAULT}"

echo -e "\n\n$sourceCode"

