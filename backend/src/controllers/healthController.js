const env = require('../config/env');
const db = require('../database/connection');

const healthController = {
  getHealth: (req, res) => {
    let dbStatus = 'healthy';
    try {
      db.get('SELECT 1 as test');
    } catch (err) {
      dbStatus = `unhealthy: ${err.message}`;
    }

    const hasGeminiKey = Boolean(
      env.GEMINI_API_KEY &&
      env.GEMINI_API_KEY !== 'your_gemini_api_key_here' &&
      env.GEMINI_API_KEY.trim() !== ''
    );

    return res.status(200).json({
      success: true,
      data: {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: Math.round(process.uptime()),
        nodeVersion: process.version,
        environment: env.NODE_ENV,
        database: {
          type: 'sqlite',
          status: dbStatus,
          path: env.DATABASE_PATH
        },
        ai: {
          provider: env.AI_PROVIDER,
          geminiKeyConfigured: hasGeminiKey,
          model: env.GEMINI_MODEL
        }
      }
    });
  }
};

module.exports = healthController;
