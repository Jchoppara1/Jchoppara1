#!/usr/bin/env bash
set -e

REMOTE_URL="https://Jchoppara1:${GITHUB_PERSONAL_ACCESS_TOKEN}@github.com/Jchoppara1/Jchoppara1.git"

echo "==> Removing Replit-internal files from git tracking..."
git rm --cached .replit 2>/dev/null || true
git rm --cached .replitignore 2>/dev/null || true
git rm --cached .agents/agent_assets_metadata.toml 2>/dev/null || true
git rm -r --cached .local/ 2>/dev/null || true
git rm -r --cached attached_assets/ 2>/dev/null || true
git rm -r --cached .migration-backup/ 2>/dev/null || true
git rm -r --cached screenshots/ 2>/dev/null || true

echo "==> Committing clean state..."
git commit -m "chore: remove Replit internals from tracking" 2>/dev/null || echo "(nothing new to commit)"

echo "==> Setting up GitHub remote..."
git remote remove github 2>/dev/null || true
git remote add github "$REMOTE_URL"

echo "==> Force-pushing to GitHub..."
git push github main --force

echo ""
echo "Done. Only source + README is on GitHub."
