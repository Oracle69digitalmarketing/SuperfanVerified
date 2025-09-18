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

async function testLeaderboard() {
  console.log("\n=== LEADERBOARD ===");
  const res = await fetch(`${BASE}/leaderboard`);
  console.log("Leaderboard:", await res.json());

  const redisRes = await fetch(`${BASE}/leaderboard/redis`);
  console.log("Redis Leaderboard:", await redisRes.json());
}

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

async function testReferrals() {
  console.log("\n=== REFERRALS ===");
  const res = await fetch(`${BASE}/referrals`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      referrerId: 1,
      referredId: 2,
    }),
  });
  console.log("Create Referral:", await res.json());

  const listRes = await fetch(`${BASE}/referrals/1`);
  console.log("User Referrals:", await listRes.json());
}

async function testVerify() {
  console.log("\n=== VERIFY ===");
  const res = await fetch(`${BASE}/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ walletAddress: "0xABC123" }),
  });
  console.log("Verify Wallet:", await res.json());
}

async function testGatedContent() {
  console.log("\n=== GATED CONTENT ===");
  const res = await fetch(`${BASE}/gated-content/1`);
  console.log("Gated Content:", await res.json());
}

async function testExternalData() {
  console.log("\n=== EXTERNAL DATA ===");
  const res = await fetch(`${BASE}/external-data`);
  console.log("External Data:", await res.json());
}

async function runAllTests() {
  await testUsers();
  await testScans();
  await testLeaderboard();
  await testWallets();
  await testReferrals();
  await testVerify();
  await testGatedContent();
  await testExternalData();
}

runAllTests().catch(err => console.error("Test run failed:", err));
