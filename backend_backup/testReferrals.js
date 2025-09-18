import fetch from "node-fetch";

const BASE = "https://superfan-backend.onrender.com";

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

testReferrals().catch(console.error);
