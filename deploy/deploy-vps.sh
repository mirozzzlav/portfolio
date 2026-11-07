#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-$HOME/portfolio}"
REMOTE="${REMOTE:-origin}"
BRANCH="${BRANCH:-main}"

cd "$APP_DIR"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Not a git repository: $APP_DIR" >&2
  exit 1
fi

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Working tree has local tracked changes. Commit, stash, or reset them before deploy." >&2
  git status --short
  exit 1
fi

git fetch "$REMOTE" "$BRANCH"
git pull --ff-only "$REMOTE" "$BRANCH"

new_rev="$(git rev-parse HEAD)"

docker compose --project-name portfolio up -d --build --remove-orphans
docker compose --project-name portfolio ps

echo "Deploy complete: $new_rev"
