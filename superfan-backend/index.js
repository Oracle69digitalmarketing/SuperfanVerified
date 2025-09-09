// backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Routers
const usersRouter = require('./routes/users');
const activityRoutes = require('./routes/activityRoutes'); // ← new route

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

// ----------------------------
// Users routes
// ----------------------------
app.use('/users', usersRouter);

// ----------------------------
// Activity routes
// ----------------------------
app.use('/activities', activityRoutes);

// ----------------------------
// Start server
// ----------------------------
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
