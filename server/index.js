const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4242;

// CORS Configuration
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn('CORS blocked request', { origin });
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

// Connect to Database
connectDB();

// Import Routes
const authRoutes = require('./routes/auth');
const razorpayRoutes = require('./routes/razorpay');
const adminRoutes = require('./routes/admin');
const emailRoutes = require('./routes/email');

// Register Routes
app.use('/api/auth', authRoutes);
app.use('/api/razorpay', razorpayRoutes);
app.use('/api/admin', adminRoutes); 
app.use('/api/email', emailRoutes);


// Health Check Route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});