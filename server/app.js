require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');

const { errorHandler, notFound } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');
const { isAIConfigured } = require('./services/aiService');

const authRoutes = require('./routes/authRoutes');
const planRoutes = require('./routes/planRoutes');

const app = express();

// ---- Security & core middleware ----
app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/api', apiLimiter);

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ---- Health / status ----
app.get('/', (req, res) => {
  res.json({ success: true, message: 'StartupHub API is running' });
});

app.get('/api/status', (req, res) => {
  res.json({
    success: true,
    aiConfigured: isAIConfigured(),
    dbConnected: mongoose.connection.readyState === 1,
  });
});

// ---- Routes ----
app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);

// ---- 404 + centralized error handler (must be last) ----
app.use(notFound);
app.use(errorHandler);

module.exports = app;
