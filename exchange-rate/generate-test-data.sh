#!/usr/bin/env bash
set -Eeuo pipefail
CURRENT_DIR="$(dirname "$0")"
cd "$CURRENT_DIR"

HIST_DATA_FILE="$(./get-random-historical-data.sh 2>&1 >/dev/null)"
HIST_DATA="$(cat "$HIST_DATA_FILE")"
HIST_DATA_COUNT="$(wc -l <<< "$HIST_DATA")"

CURRENCIES="$( (cut -d';' -f1 <<< "$HIST_DATA"; cut -d';' -f2 <<< "$HIST_DATA") | sort | uniq)"

CURRENCIES_COUNT="$(wc -l <<< "$CURRENCIES")"

CUR_ID_1="$((1+RANDOM%CURRENCIES_COUNT))"
CUR_ID_2="$((1+RANDOM%(CURRENCIES_COUNT-1)))"

CUR_1="$(sed -n "${CUR_ID_1}p" <<< "$CURRENCIES")"
CURRENCIES="$(sed "${CUR_ID_1}d" <<< "$CURRENCIES")"
CUR_2="$(sed -n "${CUR_ID_2}p" <<< "$CURRENCIES")"

MIN_AMOUNT=1
MAX_AMOUNT=1000
AMOUNT="$((MIN_AMOUNT+RANDOM%(1+MAX_AMOUNT-MIN_AMOUNT)))"

(
echo "$CUR_1;$AMOUNT;$CUR_2"
echo "$HIST_DATA_COUNT"
echo "$HIST_DATA"
) > "${HIST_DATA_FILE%.data}.input"
>&2 echo "${HIST_DATA_FILE%.data}.input"

rm "$HIST_DATA_FILE"
