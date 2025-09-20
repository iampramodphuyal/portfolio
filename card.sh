#!/bin/bash

# Get the directory where the current script is located
# SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
SCRIPT_DIR='curl'

source "curl/config.sh"


source "curl/box.sh" 

source "curl/about.sh"

echo -e "\n"
source "$SCRIPT_DIR/custom-details.sh"


source "$SCRIPT_DIR/footer.sh"

