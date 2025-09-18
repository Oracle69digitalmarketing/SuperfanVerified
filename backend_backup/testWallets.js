import fetch from "node-fetch";

const BASE = "https://superfan-backend.onrender.com";

async function testWallets() {
  console.log("\n=== WALLETS ===");
  const res = await fetch(`${BASE}/wallets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId: 1 }),
  });
  console.log("Create Wallet:", await res.json());

  const getRes = await fetch(`${BASE}/wallets/1`);
  console.log("Get Wallet:", await getRes.json());
}

testWallets().catch(console.error);
