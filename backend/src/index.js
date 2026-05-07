const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const orgRoutes = require('./routes/organizations');
const flagRoutes = require('./routes/flags');

const app = express();

app.use(cors({
  origin: ['http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003'],
  credentials: true,
}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/organizations', orgRoutes);
app.use('/api/flags', flagRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Feature Flag API is running' });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(process.env.PORT || 5000, () => {
      console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
