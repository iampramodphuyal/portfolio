#!/usr/bin/env bash

SCRIPT_DIR="${SCRIPT_DIR:-/var/task/public/curl}"

source "$SCRIPT_DIR/config.sh"
source "$SCRIPT_DIR/box.sh"

DOMAIN="${CARD_WEBSITE}"

draw_box "EXPLORE" 2 \
  "${C_GREEN}>${C_DEFAULT} ${C_CYAN}curl ${S_UNDERLINE}${DOMAIN}/projects${C_DEFAULT}${C_GRAY}     # what I've built${C_DEFAULT}" \
  "${C_GREEN}>${C_DEFAULT} ${C_CYAN}curl ${S_UNDERLINE}${DOMAIN}/blog${C_DEFAULT}${C_GRAY}         # thoughts & notes${C_DEFAULT}" \
  "${C_GREEN}>${C_DEFAULT} ${C_CYAN}curl ${S_UNDERLINE}${DOMAIN}/experience${C_DEFAULT}${C_GRAY}   # work & education${C_DEFAULT}" \
  "${C_GREEN}>${C_DEFAULT} ${C_CYAN}curl ${S_UNDERLINE}${DOMAIN}/contact${C_DEFAULT}${C_GRAY}      # get in touch${C_DEFAULT}" \
  "${C_GREEN}>${C_DEFAULT} ${C_CYAN}curl -O ${S_UNDERLINE}${DOMAIN}/resume.pdf${C_DEFAULT}${C_GRAY}  # resume${C_DEFAULT}"
