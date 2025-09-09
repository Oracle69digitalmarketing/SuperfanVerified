// backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Routers
const usersRouter = require('./routes/users');
const activityRoutes = require('./routes/activityRoutes');
const referralRoutes = require('./routes/referralRoutes');
const walletRoutes = require('./routes/walletRoutes');
const externalDataRoutes = require('./routes/externalDataRoutes');
const gatedContentRoutes = require('./routes/gatedContentRoutes');

const app = express();
app.use(cors());
app.use(express.json()); // replaces body-parser

const PORT = process.env.PORT || 5000;

// ----------------------------
// MongoDB connection
// ----------------------------
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ----------------------------
// Health check
// ----------------------------
app.get('/', (req, res) => {
  res.send({ message: '✅ SuperfanVerified backend running' });
});

// ----------------------------
// Verification endpoint
// ----------------------------
app.post('/verify', (req, res) => {
  const { rawData, wallet } = req.body;

  console.log('Verification request:', rawData, wallet);

  const verified = rawData && rawData.toLowerCase().includes('fan');

  res.json({
    success: true,
    verified,
    fanId: rawData,
    wallet,
    message: verified ? 'Fan verified successfully' : 'Not a valid fan QR',
  });
});

// ----------------------------
// Routes
// ----------------------------
app.use('/users', usersRouter);
app.use('/activities', activityRoutes);
app.use('/referrals', referralRoutes);
app.use('/wallets', walletRoutes);
app.use('/external-data', externalDataRoutes);
app.use('/gated-content', gatedContentRoutes);

// ----------------------------
// Start server
// ----------------------------
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
