#!/bin/bash
BASE_DIR="$HOME/SuperfanVerified/superfan-backend"

convert_to_esm() {
  local dir="$1"
  echo "Processing folder: $dir"

  find "$dir" -type f -name "*.js" | while read -r file; do
    echo "  Converting $file..."

    # 1️⃣ Convert express import
    sed -i "s|const express = require('express');|import express from 'express';|" "$file"

    # 2️⃣ Convert named requires to ESM imports
    sed -i -E "s|const \{ ([^}]+) \} = require\('([^']+)'\);|import { \1 } from '\2.js';|" "$file"

    # 3️⃣ Convert default requires to ESM imports
    sed -i -E "s|const ([^=]+) = require\('([^']+)'\);|import \1 from '\2.js';|" "$file"

    # 4️⃣ Convert module.exports to export default
    sed -i -E "s|module\.exports = ([^;]+);|export default \1;|" "$file"
  done
}

# Folders to convert
convert_to_esm "$BASE_DIR/routes"
convert_to_esm "$BASE_DIR/services"
convert_to_esm "$BASE_DIR/models"

echo "✅ Conversion complete. All backend files are now ESM-ready."
