#!/bin/bash

# Create folders if they don't exist
mkdir -p superfan-frontend
mkdir -p superfan-backend/{controllers,models,routes,utils,scripts,tests,config}
mkdir -p superfan-frontend/Screens
mkdir -p superfan-frontend/assets

echo "Folders created."

# Move frontend files
mv App.tsx MainApp.tsx AppNavigator.tsx SpotifyAuth.tsx TxViewer.tsx WalletProvider.tsx superfan-frontend/ 2>/dev/null
mv store.js apiClient.ts apiService.js globals.ts superfan-frontend/ 2>/dev/null
mv assets/* superfan-frontend/assets/ 2>/dev/null

# Move backend files
mv app.js superfan-backend/ 2>/dev/null
mv database.js superfan-backend/ 2>/dev/null
mv superfan_tables.sql init_superfan.sql superfan-backend/ 2>/dev/null
mv seedUsers.js generateBackendFilesSafe.js superfan-backend/scripts/ 2>/dev/null
mv controllers/* superfan-backend/controllers/ 2>/dev/null
mv routes/* superfan-backend/routes/ 2>/dev/null
mv models/* superfan-backend/models/ 2>/dev/null
mv utils/* superfan-backend/utils/ 2>/dev/null
mv config/* superfan-backend/config/ 2>/dev/null
mv test*.js superfan-backend/tests/ 2>/dev/null

# Move any remaining .js/.ts files related to backend to backend root
mv *.js *.ts superfan-backend/ 2>/dev/null

# Cleanup empty folders in root
rmdir controllers routes models utils config tests 2>/dev/null

echo "Files moved to frontend and backend folders."

# Suggest next steps
echo -e "\nNext steps:"
echo "- Review imports in frontend (superfan-frontend/) and backend (superfan-backend/) and adjust paths."
echo "- Remove any duplicate files left in the root."
echo "- Test frontend and backend builds separately."
