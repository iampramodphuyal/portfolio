#!/bin/bash

# Get the directory where the current script is located
# SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
# SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPT_DIR="public/curl"

source "$SCRIPT_DIR/config.sh"


source "$SCRIPT_DIR/box.sh" 

source "$SCRIPT_DIR/about.sh"

echo -e "\n"
source "$SCRIPT_DIR/custom-details.sh"


source "$SCRIPT_DIR/footer.sh"

