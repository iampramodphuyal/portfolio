#!/bin/bash



C_YELLOW=$'\033[33m'
C_DEFAULT=$'\033[0m'

line="─────────────────────────────"

# cols=$(tput cols) # this is for dynamic terminal width generation

cols=${COLUMNS:-120}

padding=$(( (cols - ${#line}) / 2 ))
# padding=$(( (cols + ${#line} ) / 2 ))
printf "\n\n\n\t\t${C_MAGENTA}%*s%s${C_DEFAULT}\n" $padding "" "$line"

# Example with footer text
footer="[NOTE] Minimal. Efficient. Terminal-inspired."
copyrights="© 2025 Pramod Phuyal | Last updated: Sep 2025 | v1.0"
footerPadding=$(( (cols - ${#footer}) / 2 ))
copyrightsPadding=$(( (cols - ${#copyrights}) / 2 ))
# padding=$(( (cols ) / 2 ))
printf "\t\t${C_CYAN}%*s%s${C_DEFAULT}\n" $footerPadding "" "$footer"
printf "\t\t${C_GRAY}%*s%s${C_DEFAULT}\n" $copyrightsPadding "" "$copyrights"

