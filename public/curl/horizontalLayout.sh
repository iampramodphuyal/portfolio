#!/usr/bin/env bash


SCRIPT_DIR="/var/task/public/curl"
# SCRIPT_DIR="public/curl"

strip_colors() {
    printf "%s" "$1" | sed 's/\x1b\[[0-9;]*[A-Za-z]//g' | sed 's/[🌍📧🐙💼]/  /g'
}


createHorizontalLayout () {
  local spacing="      "  # space between columns

  # read outputs
    mapfile -t left <<<"$(bash "$1")"
    mapfile -t right <<<"$(bash "$2")"

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
    local ln=$(printf "%s" "$clean_l" | wc -m)
    pad=$(( maxlen - ln ))

    printf "DEBUG: clean_l='%s', bash_len=%s, wc_len=%s, awk_len=%s, maxlen=%s, pad=%s\n" \
        "$clean_l" \
        "${#clean_l}" \
        "$ln" \
        "$(printf "%s" "$clean_l" | awk '{print length}')" \
        "$maxlen" \
        "$pad" >&2

    printf "%s%s%s%s%s\n" "$C_YELLOW" "$l" "$(printf '%*s' "$pad" '')" "$spacing" "$C_DEFAULT$r"

    done
  printf "%s\n" "$C_DEFAULT"
}
