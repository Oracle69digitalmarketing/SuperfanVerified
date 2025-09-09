import fetch from "node-fetch";

const BASE = "https://superfan-backend.onrender.com";

async function testUsers() {
  console.log("\n=== USERS ===");
  const createRes = await fetch(`${BASE}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      walletAddress: "0xABC123",
      name: "Test User",
      referredBy: null,
    }),
  });
  console.log("Create User:", await createRes.json());

  const listRes = await fetch(`${BASE}/users`);
  console.log("List Users:", await listRes.json());
}

testUsers().catch(console.error);
