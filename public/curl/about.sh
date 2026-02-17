#!/usr/bin/env bash

SCRIPT_DIR="${SCRIPT_DIR:-/var/task/public/curl}"

source "$SCRIPT_DIR/horizontalLayout.sh"

createHorizontalLayout  "$SCRIPT_DIR/name.sh" "$SCRIPT_DIR/info.sh"

