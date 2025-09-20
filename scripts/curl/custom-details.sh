#!/bin/bash

SCRIPT_DIR=$(dirname "$0")
source "$SCRIPT_DIR/horizontalLayout.sh"
# source "scripts/curl/horizontalLayout.sh"

createHorizontalLayout  "$SCRIPT_DIR/socials.sh" "$SCRIPT_DIR/neofetch.sh"

