#!/bin/bash


strip_colors() {
  echo -e "$1" | sed -E 's/\x1B\[[0-9;]*[A-Za-z]//g; s/[🌍📧🐙💼]/  /g'
}


createHorizontalLayout () {
  local spacing="         "  # space between columns

  # read outputs
    mapfile -t left <<<"$(bash "$1")"
    mapfile -t right <<<"$(bash "$2")"

  # find max width of left column (ignoring colors)
  local maxlen=0
  for l in "${left[@]}"; do
    local len
    len=$(strip_colors "$l" | awk '{print length}')
    (( len > maxlen )) && maxlen=$len
  done


local maxright=0
for r in "${right[@]}"; do
    len=$(strip_colors "$r" | awk '{print length}')
    (( len > maxright )) && maxright=$len
done

  # find max line count
  local lines=$(( ${#left[@]} > ${#right[@]} ? ${#left[@]} : ${#right[@]} ))


  # render
  for ((i=0; i<lines; i++)); do
    local l="${left[i]:-}"
    local r="${right[i]:-}"
    local clean_l=$(strip_colors "$l")
    local pad=$(( maxlen - ${#clean_l} ))


    local clean_r=$(strip_colors "$r")
    local pad_r=$(( maxright - ${#clean_r} ))


    echo "L: '${left[i]}' len=${#left[i]}"
    echo "R: '${right[i]}' len=${#right[i]}"

    printf "%s%s%*s%s%s%s%*s\n" \
      "$C_YELLOW" "$l" "$pad" "" \
      "$spacing" \
      "$C_DEFAULT" "$r" "$pad_r" ""

    # printf "%s%s%*s%s%s%s\n" \
    #   "$C_YELLOW" "$l" "$pad" "" \
    #   "$spacing" \
    #   "$C_DEFAULT" "$r"
  done
  printf "%s\n" "$C_DEFAULT"
}

