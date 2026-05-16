require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const connectDB = require('./config/db');

const app = express();

// Connect MongoDB
connectDB();

// Add this line BEFORE applying your rate-limit middleware:
app.set('trust proxy', 1); 

// Rate limiting - protect OTP endpoint from abuse
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { message: 'Too many OTP requests, try after 15 minutes' },
});

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth/send-otp', otpLimiter); // Rate limit OTP
app.use('/api/auth', require('./routes/auth'));
app.use('/api/animals', require('./routes/animals'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Animall API running 🐄' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🐄 Animall Server running on http://localhost:${PORT}`);
});
