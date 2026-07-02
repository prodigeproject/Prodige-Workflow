#!/usr/bin/env bash
# Install one Prodige pre-commit hook template into .git/hooks/pre-commit.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
STACK="${1:-node}"
SRC="$ROOT/.ai/hooks/pre-commit-$STACK.sh"
DST="$ROOT/.git/hooks/pre-commit"

[ -d "$ROOT/.git" ] || { echo "Not a git repository: $ROOT" >&2; exit 1; }
[ -f "$SRC" ] || { echo "Unknown hook stack '$STACK'. Expected $SRC" >&2; exit 1; }

mkdir -p "$(dirname "$DST")"
cp "$SRC" "$DST"
chmod +x "$DST"
echo "Installed Prodige $STACK pre-commit hook at .git/hooks/pre-commit"
