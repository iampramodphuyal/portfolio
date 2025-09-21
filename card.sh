#!/usr/bin/env bash

# Get the directory where the current script is located

SCRIPT_DIR="/var/task/public/curl"

source "$SCRIPT_DIR/config.sh"

source "$SCRIPT_DIR/box.sh" 

# source "$SCRIPT_DIR/about.sh"

source "$SCRIPT_DIR/horizontalLayout.sh"

createHorizontalLayout  "$SCRIPT_DIR/name.sh" "$SCRIPT_DIR/info.sh"


echo -e "\n"
# source "$SCRIPT_DIR/custom-details.sh"

createHorizontalLayout  "$SCRIPT_DIR/socials.sh" "$SCRIPT_DIR/neofetch.sh"


source "$SCRIPT_DIR/footer.sh"

