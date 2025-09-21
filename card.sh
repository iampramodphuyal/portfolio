#!/usr/bin/env bash

# Get the directory where the current script is located

SCRIPT_DIR="/var/task/public/curl"

source "$SCRIPT_DIR/config.sh"

source "$SCRIPT_DIR/box.sh" 

# source "$SCRIPT_DIR/about.sh"

createHorizontalLayout  "$SCRIPT_DIR/name.sh" "$SCRIPT_DIR/info.sh"


echo -e "\n"
# source "$SCRIPT_DIR/custom-details.sh"

createHorizontalLayout  "$SCRIPT_DIR/socials.sh" "$SCRIPT_DIR/neofetch.sh"


source "$SCRIPT_DIR/footer.sh"









createHorizontalLayout () {
  local spacing="             "  # space between columns

  # read outputs
  # mapfile -t left  < <(bash "$1")
  # mapfile -t right < <(bash "$2")

    bash "$1" | mapfile -t left
    bash "$2" | mapfile -t right

  # find max width of left column (ignoring colors)
  local maxlen=0
  for l in "${left[@]}"; do
    local len
    len=$(strip_colors "$l" | awk '{print length}')
    (( len > maxlen )) && maxlen=$len
  done

  # find max line count
  local lines=$(( ${#left[@]} > ${#right[@]} ? ${#left[@]} : ${#right[@]} ))

  # render
  for ((i=0; i<lines; i++)); do
    local l="${left[i]:-}"
    local r="${right[i]:-}"
    local clean_l=$(strip_colors "$l")
    local pad=$(( maxlen - ${#clean_l} ))
    printf "%s%s%*s%s%s%s\n" \
      "$C_YELLOW" "$l" "$pad" "" \
      "$spacing" \
      "$C_DEFAULT" "$r"
  done
  printf "%s\n" "$C_DEFAULT"
}
