const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// healthcheck
app.get('/', (req, res) => {
  res.json({ status: 'Superfan backend is running 🚀' });
});

// routes
app.use('/api', userRoutes);

// dynamic port for deployment
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Superfan backend running on port ${PORT}`);
});
