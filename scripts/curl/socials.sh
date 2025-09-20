#!/bin/bash

# This files contains info about my social networks
#
#


SCRIPT_DIR=$(dirname "$0")
source "scripts/curl/config.sh"
source "scripts/curl/box.sh" 

draw_box "SOCIALS" 2 \
  "${I_WEBSITE} ${C_GREEN}${S_UNDERLINE}${CARD_WEBSITE}${C_DEFAULT}" \
  "" \
  "${I_EMAIL} ${C_YELLOW}${CARD_EMAIL}${C_DEFAULT}" \
  "" \
  "${I_GITHUB} ${C_CYAN}${S_UNDERLINE}${CARD_GITHUB}${C_DEFAULT}" \
  "" \
  "${I_LINKEDIN} ${C_BLUE}${S_UNDERLINE}${CARD_LINKEDIN}${C_DEFAULT}"

