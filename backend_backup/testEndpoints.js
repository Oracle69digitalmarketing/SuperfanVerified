// testEndpoints.js
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = `http://localhost:${process.env.PORT || 5000}/api`;

async function testTokenFlow() {
  console.log('--- Testing Token Endpoints ---');

  // 1️⃣ Create dummy user (replace with your actual user _id)
  const userId = '64f8c8e4e1a2b123456789ab'; 
  const dummyUser = { _id: userId, provider: 'local' };

  // 2️⃣ Create tokens for user
  let res = await fetch(`${BASE_URL}/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dummyUser),
  });
  const tokens = await res.json();
  console.log('Tokens created:', tokens);

  // 3️⃣ Refresh token
  res = await fetch(`${BASE_URL}/token/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: tokens.refreshToken }),
  });
  const refreshed = await res.json();
  console.log('Token refreshed:', refreshed);

  // 4️⃣ Revoke token
  res = await fetch(`${BASE_URL}/token/revoke`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: tokens.refreshToken }),
  });
  const revoked = await res.json();
  console.log('Token revoked:', revoked);
}

async function testZkTLSFlow() {
  console.log('--- Testing zkTLS Endpoints ---');

  const dummyPayload = { userId: '64f8c8e4e1a2b123456789ab', payload: { test: 'data' } };

  // 1️⃣ Generate proof
  let res = await fetch(`${BASE_URL}/zktls/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dummyPayload),
  });
  const proof = await res.json();
  console.log('Proof generated:', proof);

  if (!proof.success) return;

  // 2️⃣ Verify proof
  res = await fetch(`${BASE_URL}/zktls/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ proofId: proof.proof?.id || 'dummy-proof-id' }),
  });
  const verified = await res.json();
  console.log('Proof verified:', verified);
}

async function runTests() {
  try {
    await testTokenFlow();
    await testZkTLSFlow();
    console.log('✅ All tests completed');
  } catch (err) {
    console.error('❌ Test failed:', err.message);
  }
}

runTests();
