#!/usr/bin/env bash

export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8

# Get the directory where the current script is located

SCRIPT_DIR="/var/task/public/curl"
# SCRIPT_DIR="public/curl"

source "$SCRIPT_DIR/config.sh"
source "$SCRIPT_DIR/box.sh" 
source "$SCRIPT_DIR/horizontalLayout.sh" 

source "$SCRIPT_DIR/about.sh"

echo -e "\n"
source "$SCRIPT_DIR/custom-details.sh"

source "$SCRIPT_DIR/footer.sh"

