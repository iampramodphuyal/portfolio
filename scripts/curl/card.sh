#!/bin/bash

# Get the directory where the current script is located
SCRIPT_DIR=$(dirname "$0")

source "scripts/curl/config.sh"


source "scripts/curl/box.sh" 

source "scripts/curl/about.sh"

echo -e "\n"
# source assets/curl/socials.sh
source "scripts/curl/custom-details.sh"


source "scripts/curl/footer.sh"
