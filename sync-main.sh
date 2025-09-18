#!/bin/bash
set -e

# Ensure we are on main
git checkout main

# Fetch latest from remote and overwrite local
echo "🔄 Fetching latest from GitHub..."
git fetch origin
git reset --hard origin/main
git clean -fd

# Stage all changes
echo "📝 Staging changes..."
git add .

# Commit changes
echo "💾 Committing..."
git commit -m "Update main with local changes" --allow-empty

# Push to main
echo "🚀 Pushing to GitHub main..."
git push origin main --force

echo "✅ Done! Local main is synced and pushed to GitHub."

