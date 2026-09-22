const mongoose = require('mongoose');
const dns = require('dns');

// Prefer IPv4 because some networks have unstable IPv6 routing
dns.setDefaultResultOrder('ipv4first');

// Use reliable public DNS servers for MongoDB Atlas SRV lookup
dns.setServers([
  '1.1.1.1',
  '8.8.8.8'
]);

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    console.error('❌ MONGODB_URI is not set in server/.env');
    process.exit(1);
  }

  try {
    console.log('🔄 Connecting to MongoDB Atlas...');

    await mongoose.connect(mongoUri, {
      tls: true,

      // Force IPv4
      family: 4,

      // Connection timeouts
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,

      // Connection pool
      maxPoolSize: 10,
      minPoolSize: 1,

      // Keep connection healthy
      heartbeatFrequencyMS: 10000,
    });

    console.log(
      `✅ MongoDB connected: ${mongoose.connection.host}`
    );

  } catch (error) {
    console.error(
      '❌ MongoDB connection failed:',
      error.message
    );

    process.exit(1);
  }
};


// MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('🟢 MongoDB connection active');
});

mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB error:', error.message);
});

mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected - attempting to reconnect...');
});

mongoose.connection.on('reconnected', () => {
  console.log('🔄 MongoDB reconnected successfully');
});

mongoose.connection.on('connecting', () => {
  console.log('🔄 MongoDB connecting...');
});

mongoose.connection.on('close', () => {
  console.warn('🔴 MongoDB connection closed');
});


module.exports = connectDB;