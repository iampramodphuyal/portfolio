#!/bin/bash

# Colors
C_DEFAULT="\033[0m"
C_WHITE="\033[1;37m"
C_BLACK="\033[30m"
C_RED="\033[31m"
C_GREEN="\033[32m"
C_YELLOW="\033[33m"
C_BLUE="\033[34m"
C_MAGENTA="\033[35m"
C_CYAN="\033[36m"
C_GRAY="\033[90m"

# Styles
S_BOLD="\033[1m"
S_UNDERLINE="\033[4m"

# Icons
I_WEBSITE="\033[38;5;81m🌍"
I_EMAIL="\033[38;5;208m📧"
I_GITHUB="\033[38;5;245m🐙"
I_LINKEDIN="\033[38;5;33m💼"

# Card Content
CARD_NAME="Pramod Phuyal"
CARD_TITLE="Software Developer"
CARD_WEBSITE="https://pramod.vercel.app"
CARD_EMAIL="pramodphuyal58@gmail.com"
CARD_GITHUB="https://github.com/pramod-phuyal"
CARD_LINKEDIN="https://www.linkedin.com/in/pramod-phuyal/"

# Render Card
echo -e "${C_DEFAULT}"
echo -e "${C_WHITE}${S_BOLD}${CARD_NAME}${C_DEFAULT}"
echo -e "${C_GRAY}${CARD_TITLE}${C_DEFAULT}"
echo -e ""
echo -e "${I_WEBSITE}  ${C_GREEN}${S_UNDERLINE}${CARD_WEBSITE}${C_DEFAULT}"
echo -e "${I_EMAIL}  ${C_YELLOW}${CARD_EMAIL}${C_DEFAULT}"
echo -e "${I_GITHUB}  ${C_CYAN}${S_UNDERLINE}${CARD_GITHUB}${C_DEFAULT}"
echo -e "${I_LINKEDIN} ${C_BLUE}${S_UNDERLINE}${CARD_LINKEDIN}${C_DEFAULT}"
echo -e ""
