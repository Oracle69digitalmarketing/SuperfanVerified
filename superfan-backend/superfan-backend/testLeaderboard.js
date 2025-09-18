import fetch from "node-fetch";

const BASE = "https://superfan-backend.onrender.com";

async function testLeaderboard() {
  console.log("\n=== LEADERBOARD ===");
  const res = await fetch(`${BASE}/leaderboard`);
  console.log("Leaderboard:", await res.json());

  const redisRes = await fetch(`${BASE}/leaderboard/redis`);
  console.log("Redis Leaderboard:", await redisRes.json());
}

testLeaderboard().catch(console.error);
