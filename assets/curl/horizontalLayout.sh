#!/bin/bash

source assets/curl/config.sh

source assets/curl/box.sh 


createHorizontalLayout () {
  local spacing="             "  # space between columns

  # read outputs
  mapfile -t left  < <(bash "$1")
  mapfile -t right < <(bash "$2")

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

