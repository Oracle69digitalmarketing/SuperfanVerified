#!/bin/bash
BASE_DIR="$HOME/SuperfanVerified/superfan-backend"

convert_to_esm() {
  local dir="$1"
  echo "Processing folder: $dir"

  find "$dir" -type f -name "*.js" | while read -r file; do
    echo "  Converting $file..."

    # Convert express import if present
    sed -i "s|const express = require('express');|import express from 'express';|" "$file"

    # Convert other require statements to ESM imports
    sed -i -E "s|const \{ (.*) \} = require\('(.*)'\);|import { \1 } from '\2.js';|" "$file"
    sed -i -E "s|const (.*) = require\('(.*)'\);|import \1 from '\2.js';|" "$file"

    # Convert module.exports = ... to export default ...
    sed -i "s|module.exports = \(.*\);|export default \1;|" "$file"
  done
}

# Convert routes, services, and models
convert_to_esm "$BASE_DIR/routes"
convert_to_esm "$BASE_DIR/services"
convert_to_esm "$BASE_DIR/models"

echo "✅ All backend files converted to ESM."
