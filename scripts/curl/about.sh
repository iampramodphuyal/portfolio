#!/bin/bash

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
source "$SCRIPT_DIR/horizontalLayout.sh"

createHorizontalLayout  "$SCRIPT_DIR/name.sh" "$SCRIPT_DIR/info.sh"

