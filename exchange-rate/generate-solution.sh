#!/usr/bin/env bash
set -Eeuo pipefail
CURRENT_DIR="$(dirname "$0")"
cd "$CURRENT_DIR"

INPUT_FILE="$(./generate-test-data.sh 2>&1 >/dev/null)"
./exchange-rate "$INPUT_FILE" > "${INPUT_FILE%.input}.output" 2>"${INPUT_FILE%.input}.explanation"
