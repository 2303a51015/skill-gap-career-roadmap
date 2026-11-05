const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables from .env if present
const rootEnvPath = path.resolve(__dirname, '../../../.env');
const backendEnvPath = path.resolve(__dirname, '../../.env');

if (fs.existsSync(backendEnvPath)) {
  dotenv.config({ path: backendEnvPath });
} else if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else {
  dotenv.config();
}

const env = {
  PORT: parseInt(process.env.PORT, 10) || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-flash-lite-latest',
  AI_PROVIDER: process.env.AI_PROVIDER || 'gemini', // 'gemini' | 'mock'
  DATABASE_PATH: process.env.DATABASE_PATH
    ? path.resolve(process.cwd(), process.env.DATABASE_PATH)
    : path.resolve(__dirname, '../../data/career_roadmap.sqlite'),
  MAX_FILE_SIZE_MB: parseInt(process.env.MAX_FILE_SIZE_MB, 10) || 5,
  UPLOAD_TEMP_DIR: process.env.UPLOAD_TEMP_DIR
    ? path.resolve(process.cwd(), process.env.UPLOAD_TEMP_DIR)
    : path.resolve(__dirname, '../../temp_uploads'),
  REPORTS_DIR: path.resolve(__dirname, '../../reports')
};

// Ensure required directories exist
[
  path.dirname(env.DATABASE_PATH),
  env.UPLOAD_TEMP_DIR,
  env.REPORTS_DIR
].forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

module.exports = env;
