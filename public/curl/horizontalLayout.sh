#!/usr/bin/env bash


SCRIPT_DIR="${SCRIPT_DIR:-/var/task/public/curl}"

strip_colors() {
    printf "%s" "$1" | sed 's/\x1b\[[0-9;]*[A-Za-z]//g' | sed 's/[🌍📧🐙💼]/  /g'
}


createHorizontalLayout () {
  local spacing="          "  # space between columns

  # read outputs into arrays (compatible with bash 3.2+)
    local i=0
    local left=()
    while IFS= read -r line; do
      left[i]="$line"
      i=$((i + 1))
    done <<<"$(bash "$1")"

    i=0
    local right=()
    while IFS= read -r line; do
      right[i]="$line"
      i=$((i + 1))
    done <<<"$(bash "$2")"

  # find max width of left column (ignoring colors)
  local maxlen=0
  for l in "${left[@]}"; do
    local clean_l=$(strip_colors "$l")
    local len=$(printf "%s" "$clean_l" | wc -m)
    (( len > maxlen )) && maxlen=$len
  done

  # find max line count
  local lines=$(( ${#left[@]} > ${#right[@]} ? ${#left[@]} : ${#right[@]} ))

  # render
  for ((i=0; i<lines; i++)); do
    local l
    local r
    local clean_l
    local pad
    l="${left[i]:-}"
    r="${right[i]:-}"
    clean_l=$(strip_colors "$l")
    local ln=$(printf "%s" "$clean_l"  | wc -m)
    pad=$(( maxlen - ln ))

    # echo -e "pad: $pad | maxlen: $maxlen | ln: $ln"

    printf "%s%s%s%s%s%s\n" "$C_YELLOW" "$l" "$(printf '%*s' "$pad" '')" "$spacing" "$C_DEFAULT" "$r"

  done
  printf "%s\n" "$C_DEFAULT"
}
