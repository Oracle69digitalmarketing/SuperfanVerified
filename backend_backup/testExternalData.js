import fetch from "node-fetch";

const BASE = "https://superfan-backend.onrender.com";

async function testExternalData() {
  console.log("\n=== EXTERNAL DATA ===");
  const res = await fetch(`${BASE}/external-data`);
  console.log("External Data:", await res.json());
}

testExternalData().catch(console.error);
