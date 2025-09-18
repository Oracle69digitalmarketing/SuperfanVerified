#!/bin/bash
set -e

# 1️⃣ Make sure we are on main
git checkout main

# 2️⃣ Sync local main with remote (overwrites local changes)
echo "🔄 Fetching latest from GitHub..."
git fetch origin
git reset --hard origin/main
git clean -fd

# 3️⃣ Stage all changes
echo "📝 Staging changes..."
git add .

# 4️⃣ Commit changes
echo "💾 Committing..."
git commit -m "Update main with local changes" --allow-empty

# 5️⃣ Push to main
echo "🚀 Pushing to GitHub main..."
git push origin main --force

echo "✅ Done! Local main is synced and pushed to GitHub."
