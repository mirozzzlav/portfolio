#!/usr/bin/env bash
set -euo pipefail

APP_DIR="${APP_DIR:-/var/www/html/portfolio}"
REMOTE="${REMOTE:-origin}"
BRANCH="${BRANCH:-}"
API_SERVICE="${API_SERVICE:-portfolio-api}"

cd "$APP_DIR"

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Not a git repository: $APP_DIR" >&2
  exit 1
fi

if [[ -z "$BRANCH" ]]; then
  BRANCH="$(git branch --show-current)"
fi

if [[ -z "$BRANCH" ]]; then
  echo "Cannot detect current git branch. Set BRANCH=main explicitly." >&2
  exit 1
fi

if ! git diff --quiet || ! git diff --cached --quiet; then
  echo "Working tree has local tracked changes. Commit, stash, or reset them before deploy." >&2
  git status --short
  exit 1
fi

old_rev="$(git rev-parse HEAD)"

git fetch "$REMOTE" "$BRANCH"
git pull --ff-only "$REMOTE" "$BRANCH"

new_rev="$(git rev-parse HEAD)"

if [[ ! -d node_modules ]] || ! git diff --quiet "$old_rev" "$new_rev" -- package.json package-lock.json; then
  npm ci
fi

npm run build

if [[ ! -d api/.venv ]]; then
  python3 -m venv api/.venv
fi

if [[ ! -x api/.venv/bin/uvicorn ]] || ! git diff --quiet "$old_rev" "$new_rev" -- api/pyproject.toml; then
  api/.venv/bin/pip install -e api
fi

if command -v systemctl >/dev/null 2>&1 && systemctl list-unit-files "$API_SERVICE.service" >/dev/null 2>&1; then
  if [[ "$(id -u)" -eq 0 ]]; then
    systemctl restart "$API_SERVICE"
  elif sudo -n true 2>/dev/null; then
    sudo systemctl restart "$API_SERVICE"
  else
    echo "Skipped API restart: sudo is not passwordless. Restart manually:"
    echo "  sudo systemctl restart $API_SERVICE"
  fi
fi

echo "Deploy complete: $new_rev"
