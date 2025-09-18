// fix-imports.js
// Usage: node fix-imports.js
// Fixes import paths after moving frontend files into src/

const fs = require('fs');
const path = require('path');

const BASE_DIR = process.cwd(); // SuperfanVerified root
const BACKEND_DIR = path.join(BASE_DIR, 'superfan-backend');
const FRONTEND_DIR = path.join(BASE_DIR, 'superfan-frontend');
const FRONTEND_SRC = path.join(FRONTEND_DIR, 'src');
const EXTENSIONS = ['.js', '.ts', '.tsx'];

// Recursively get all JS/TS/TSX files in a folder
function getFiles(dir) {
  let files = [];
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      files = files.concat(getFiles(fullPath));
    } else if (EXTENSIONS.includes(path.extname(file))) {
      files.push(fullPath);
    }
  });
  return files;
}

// Compute new relative path from file to target
function fixPath(file, importPath) {
  // Ignore external modules
  if (!importPath.startsWith('.') && !importPath.startsWith('/')) {
    return importPath;
  }

  // Always point imports of globals.ts to src/globals.ts
  if (importPath.includes('globals')) {
    const globalsPath = path.join(FRONTEND_SRC, 'globals.ts');
    const relPath = path.relative(path.dirname(file), globalsPath).replace(/\\/g, '/');
    return relPath.startsWith('.') ? relPath : './' + relPath;
  }

  // Resolve other relative imports
  const absImport = path.resolve(path.dirname(file), importPath);
  const possibleExts = ['', '.js', '.ts', '.tsx'];

  for (const ext of possibleExts) {
    if (fs.existsSync(absImport + ext)) {
      const relPath = path.relative(path.dirname(file), absImport + ext).replace(/\\/g, '/');
      return relPath.startsWith('.') ? relPath : './' + relPath;
    }
  }

  return importPath; // fallback
}

// Rewrite import/export paths in a file
function processFile(file) {
  let content = fs.readFileSync(file, 'utf8');
  const regex = /(import\s+.*?\s+from\s+["'])(.*?)(["'];?)/g;

  content = content.replace(regex, (_, pre, imp, post) => {
    const newPath = fixPath(file, imp);
    return pre + newPath + post;
  });

  fs.writeFileSync(file, content, 'utf8');
  console.log('Processed:', file);
}

// Run for backend
console.log('Fixing backend imports...');
getFiles(BACKEND_DIR).forEach(processFile);

// Run for frontend src only
console.log('Fixing frontend src imports...');
getFiles(FRONTEND_SRC).forEach(processFile);

console.log('✅ All import paths updated, including globals.ts!');
