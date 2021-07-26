#!/usr/bin/env bash
set -Eeuo pipefail
CURRENT_DIR="$(dirname "$0")"
cd "$CURRENT_DIR"

SRC_BASE_URL="https://www.forexite.com/free_forex_quotes/"

MIN_YEAR=00
MAX_YEAR=20
YEAR=$((MIN_YEAR + RANDOM % (1+MAX_YEAR-MIN_YEAR)))
YEAR=$(printf "%02d" $YEAR)

MONTH=$((1 + RANDOM % 12))
MONTH=$(printf "%02d" $MONTH)
DAY=$((1 + RANDOM % 28))
DAY=$(printf "%02d" $DAY)

SRC_PATH="20$YEAR/$MONTH/$DAY$MONTH$YEAR.zip"

mkdir -p ./test-data
wget -qO - "$SRC_BASE_URL$SRC_PATH" | gunzip | tail -n +2 | \
awk -F',' '$1!=CURCUR{CURCUR=$1; print substr($1,1,3) ";" substr($1,4,6) ";" $4}' > "./test-data/20$YEAR-$MONTH-$DAY.data"
>&2 echo "./test-data/20$YEAR-$MONTH-$DAY.data"
