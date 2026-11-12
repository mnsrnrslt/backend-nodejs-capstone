#!/usr/bin/env bash
# Runs the 5 API checks required for the final submission and saves each
# (command + output) into its own file: mainpage, register, login, item_detail, search_item
#
# Usage (backend must be running):
#   bash scripts/curl-tests.sh                       # uses http://localhost:3060
#   bash scripts/curl-tests.sh https://your-backend-url

BASE="${1:-http://localhost:3060}"
EMAIL="${EMAIL:-mansur.test@example.com}"
PASSWORD="${PASSWORD:-Test12345}"
OUT_DIR="${OUT_DIR:-submission}"
mkdir -p "$OUT_DIR"

# $1 = file name, $2 = command as a string
run() {
  {
    echo "\$ $2"
    eval "$2"
    echo
  } | tee "$OUT_DIR/$1"
  echo "---- saved to $OUT_DIR/$1"
  echo
}

run mainpage    "curl -s $BASE/api/gifts"

run register    "curl -s -X POST $BASE/api/auth/register -H 'Content-Type: application/json' -d '{\"firstName\":\"Mansur\",\"lastName\":\"Test\",\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}'"

run login       "curl -s -X POST $BASE/api/auth/login -H 'Content-Type: application/json' -d '{\"email\":\"$EMAIL\",\"password\":\"$PASSWORD\"}'"

run item_detail "curl -s $BASE/api/gifts/1"

run search_item "curl -s '$BASE/api/search?category=Office'"
