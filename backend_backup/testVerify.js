import fetch from "node-fetch";

const BASE = "https://superfan-backend.onrender.com";

async function testVerify() {
  console.log("\n=== VERIFY ===");
  const res = await fetch(`${BASE}/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress: "0xABC123" }),
  });
  console.log("Verify Wallet:", await res.json());
}

testVerify().catch(console.error);
