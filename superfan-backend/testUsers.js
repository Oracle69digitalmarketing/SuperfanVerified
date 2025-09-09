// testUsers.js
import fetch from 'node-fetch';

const BASE = 'http://localhost:3000'; // adjust port if different

// 🔐 Create user test
async function testCreateUser() {
  const res = await fetch(`${BASE}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      walletAddress: '0xTESTUSER123456',
      name: 'Test User',
      referredBy: null
    })
  });
  const data = await res.json();
  console.log('Create User →', data);
}

// 📋 List users test
async function testListUsers() {
  const res = await fetch(`${BASE}/api/users`);
  const data = await res.json();
  console.log('List Users →', data.slice(0, 3));
}

(async () => {
  await testCreateUser();
  await testListUsers();
})();
