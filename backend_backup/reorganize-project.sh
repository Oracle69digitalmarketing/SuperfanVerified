#!/bin/bash

# Confirm current directory
echo "Current directory: $(pwd)"

# -----------------------------
# 1. Move backend files/folders to superfan-backend
# -----------------------------
echo "Moving backend files..."

# Create backend folders if not exist
mkdir -p superfan-backend/{controllers,routes,models,utils,config,scripts,tests}

# Move scripts
mv -v generateBackendFilesSafe.js seedUsers.js setup-backend.sh superfan-backend/scripts/ 2>/dev/null
mv -v init-Superfan.sql superfan_tables.sql schema.sql superfan-backend/scripts/ 2>/dev/null

# Move backend JS/TS files in root
for f in app.js database.js package.json package-lock.json config.js; do
  if [ -f "$f" ]; then
    mv -v "$f" superfan-backend/
  fi
done

# Move controllers, routes, utils, tests folders if exist in root
for dir in controllers routes utils tests config models; do
  if [ -d "$dir" ]; then
    mv -v "$dir" superfan-backend/
  fi
done

# -----------------------------
# 2. Clean any remaining duplicate backend files in root
# -----------------------------
echo "Cleaning duplicate backend files in root..."
rm -v -f app.js database.js package.json package-lock.json init-Superfan.sql superfan_tables.sql schema.sql generateBackendFilesSafe.js seedUsers.js setup-backend.sh 2>/dev/null

# -----------------------------
# 3. Verify frontend folder exists
# -----------------------------
if [ ! -d "superfan-frontend" ]; then
  echo "Error: superfan-frontend folder missing!"
else
  echo "Frontend folder OK."
fi

# -----------------------------
# 4. Summary of new structure
# -----------------------------
echo "Final structure:"
ls -1
echo "Backend folder contents:"
ls -R superfan-backend/
echo "Frontend folder contents:"
ls -R superfan-frontend/

echo "✅ Project reorganized successfully!"
