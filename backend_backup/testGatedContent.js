import fetch from "node-fetch";

const BASE = "https://superfan-backend.onrender.com";

async function testGatedContent() {
  console.log("\n=== GATED CONTENT ===");
  const res = await fetch(`${BASE}/gated-content/1`);
  console.log("Gated Content:", await res.json());
}

testGatedContent().catch(console.error);
