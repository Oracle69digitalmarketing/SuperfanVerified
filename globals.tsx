// globals.ts

// Polyfill for Buffer
import { Buffer } from 'buffer';
global.Buffer = Buffer;

// Polyfill for process
import process from 'process';
global.process = process;

// Optional: Polyfill for globalThis if needed
if (typeof globalThis === 'undefined') {
  (global as any).globalThis = global;
}

// Optional: Add other polyfills or shims here
// Example: crypto (if using crypto-browserify or similar)
// import crypto from 'crypto';
// global.crypto = crypto;
