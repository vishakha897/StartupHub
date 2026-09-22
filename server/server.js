require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');
const { isAIConfigured } = require('./services/aiService');

const PORT = process.env.PORT || 5000;

const start = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 StartupHub server running on port ${PORT}`);
    console.log(`   AI business-plan generation: ${isAIConfigured() ? 'ENABLED' : 'NOT CONFIGURED (set AI_API_KEY in .env)'}`);
  });
};

start();
