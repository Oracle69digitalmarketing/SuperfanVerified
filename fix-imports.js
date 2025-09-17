// fix-imports.js
// Usage: node fix-imports.js

const fs = require("fs");
const path = require("path");

const BASE_DIR = process.cwd(); // SuperfanVerified root
const BACKEND_DIR = path.join(BASE_DIR, "superfan-backend");
const FRONTEND_DIR = path.join(BASE_DIR, "superfan-frontend");
const SRC_DIR = path.join(FRONTEND_DIR, "src");
const EXTENSIONS = [".js", ".ts", ".tsx"];

// --------------------------
// Step 0: Move globals.ts into frontend/src
// --------------------------
const globalsOld = path.join(FRONTEND_DIR, "globals.ts");
const globalsNew = path.join(SRC_DIR, "globals.ts");

if (fs.existsSync(globalsOld)) {
  if (!fs.existsSync(SRC_DIR)) {
    fs.mkdirSync(SRC_DIR, { recursive: true });
    console.log("✅ Created superfan-frontend/src directory");
  }
  fs.renameSync(globalsOld, globalsNew);
  console.log(`✅ Moved globals.ts → ${globalsNew}`);
} else {
  console.log("ℹ️ No globals.ts at frontend root (already moved?)");
}

// --------------------------
// Utility: Recursively get all JS/TS/TSX files
// --------------------------
function getFiles(dir) {
  let files = [];
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      files = files.concat(getFiles(fullPath));
    } else if (EXTENSIONS.includes(path.extname(file))) {
      files.push(fullPath);
    }
  });
  return files;
}

// --------------------------
// Compute new relative path from file to target
// --------------------------
function fixPath(file, importPath) {
  // Ignore external modules
  if (!importPath.startsWith(".") && !importPath.startsWith("/")) {
    return importPath;
  }

  const absImport = path.resolve(path.dirname(file), importPath);

  // Always map globals.ts to frontend/src/globals.ts
  if (importPath.includes("globals")) {
    const relPath = path
      .relative(path.dirname(file), globalsNew)
      .replace(/\\/g, "/");
    return relPath.startsWith(".") ? relPath : "./" + relPath;
  }

  if (
    fs.existsSync(absImport) ||
    fs.existsSync(absImport + ".js") ||
    fs.existsSync(absImport + ".ts") ||
    fs.existsSync(absImport + ".tsx")
  ) {
    const relPath = path
      .relative(path.dirname(file), absImport)
      .replace(/\\/g, "/");
    return relPath.startsWith(".") ? relPath : "./" + relPath;
  }

  return importPath; // fallback
}

// --------------------------
// Rewrite imports in a file
// --------------------------
function processFile(file) {
  let content = fs.readFileSync(file, "utf8");

  const regex = /(import\s+.*?\s+from\s+["'])(.*?)(["'];?)/g;
  content = content.replace(regex, (_, pre, imp, post) => {
    const newPath = fixPath(file, imp);
    return pre + newPath + post;
  });

  fs.writeFileSync(file, content, "utf8");
  console.log("🔄 Processed:", file);
}

// --------------------------
// Run
// --------------------------
console.log("Fixing backend imports...");
getFiles(BACKEND_DIR).forEach(processFile);

console.log("Fixing frontend imports...");
getFiles(FRONTEND_DIR).forEach(processFile);

console.log("✨ All import paths updated, globals.ts centralized in src/");
