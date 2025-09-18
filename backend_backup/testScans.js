import fetch from "node-fetch";

const BASE = "https://superfan-backend.onrender.com";

async function testScans() {
  console.log("\n=== SCANS ===");
  const scanRes = await fetch(`${BASE}/scans`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId: 1,
      artist: "Test Artist",
    }),
  });
  console.log("Add Scan:", await scanRes.json());

  const listRes = await fetch(`${BASE}/scans`);
  console.log("List Scans:", await listRes.json());
}

testScans().catch(console.error);
