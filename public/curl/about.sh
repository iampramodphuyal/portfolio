#!/usr/bin/env bash

SCRIPT_DIR="/var/task/public/curl"
SCRIPT_DIR="public/curl"

source "$SCRIPT_DIR/horizontalLayout.sh"

createHorizontalLayout  "$SCRIPT_DIR/name.sh" "$SCRIPT_DIR/info.sh"

