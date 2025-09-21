#!/bin/bash

# SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
# SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# SCRIPT_DIR="public/curl"
SCRIPT_DIR="/var/task/public/curl"

source "$SCRIPT_DIR/config.sh"

strip_colors() {
  echo -e "$1" \
    | sed -E 's/\x1B\[[0-9;]*[A-Za-z]//g' \
    | sed -E 's/[🌍📧🐙💼]/  /g'
}


# --- Draw a boxed table ---
# Usage: draw_box "Title text" padding "line1" "line2" "line3"
draw_box() {
  local title="$1"
  local padding="$2"
  shift 2
  local lines=("$@")

  # Find max width of content
  local maxlen=0
  for line in "${lines[@]}"; do
    local clean=$(strip_colors "$line")
    (( ${#clean} > maxlen )) && maxlen=${#clean}
  done

  # Box width (content + padding left/right)
  local width=$((maxlen + padding*2))

  # Prepare title text (optional)
  local title_str=""
  if [[ -n "$title" ]]; then
    title_str="${title}"
  fi

  # Top border
  if [[ -n "$title_str" ]]; then
    local title_len=${#title_str}
    local left=$(( (width - title_len) / 2 ))
    local right=$(( width - title_len - left ))
    echo -n "┌"; printf '─%.0s' $(seq 1 $left); echo -n "$title_str"; printf '─%.0s' $(seq 1 $right); echo "┐"
  else
    echo -n "┌"; printf '─%.0s' $(seq 1 $width); echo "┐"
  fi

  # Content lines
  for line in "${lines[@]}"; do
    local clean=$(strip_colors "$line")
    local pad_right=$((maxlen - ${#clean} + padding))
    local formatteLine=$(echo -e "$line") # since printf doesnot provide colored output like echo
    printf "│%*s%s%*s│\n" "$padding" "" "${formatteLine}" "$pad_right" ""
  done

  # Bottom border
  echo -n "└"; printf '─%.0s' $(seq 1 $width); echo "┘"
}

