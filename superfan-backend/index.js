// backend/index.js (or server.js)
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔑 Verify route
app.post('/verify', (req, res) => {
  const { rawData, wallet } = req.body;

  console.log('Verification request:', rawData, wallet);

  // Fake check: if QR contains "fan", mark verified
  const verified = rawData && rawData.toLowerCase().includes('fan');

  res.json({
    success: true,
    verified,
    fanId: rawData,
    wallet,
    message: verified ? 'Fan verified successfully' : 'Not a valid fan QR',
  });
});

// Health check
app.get('/', (req, res) => {
  res.send('✅ SuperfanVerified backend running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
