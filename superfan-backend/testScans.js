import axios from 'axios';

const API = 'http://localhost:5000/api/scans'; // adjust if deployed

// 🔥 Test 1: Add a new scan
async function addScan() {
  try {
    const res = await axios.post(API, {
      userId: 1,        // replace with valid user ID
      artist: 'Drake', // test artist
    }, {
      headers: { 'x-source': 'test-script' }
    });

    console.log('✅ Scan added:', res.data);
  } catch (err) {
    console.error('❌ Error adding scan:', err.response?.data || err.message);
  }
}

// 🔍 Test 2: Fetch recent scans
async function listScans() {
  try {
    const res = await axios.get(API);
    console.log('✅ Recent scans:', res.data.slice(0, 3)); // show first 3
  } catch (err) {
    console.error('❌ Error fetching scans:', err.response?.data || err.message);
  }
}

async function run() {
  await addScan();
  await listScans();
}

run();
