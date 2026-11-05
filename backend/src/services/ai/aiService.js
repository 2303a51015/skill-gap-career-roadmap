const env = require('../../config/env');
const logger = require('../../utils/logger');
const { analyzeWithGemini } = require('./geminiProvider');
const { analyzeWithMock } = require('./mockProvider');

/**
 * Unified AI Service orchestrator.
 * Dynamically routes to configured provider (Gemini or Mock).
 */
async function performSkillGapAnalysis(params) {
  const provider = (env.AI_PROVIDER || 'gemini').toLowerCase();
  const isTest = env.NODE_ENV === 'test';

  logger.info(`Starting Skill Gap Analysis using provider: [${isTest ? 'mock (test mode)' : provider}]`);

  if (isTest || provider === 'mock') {
    return analyzeWithMock(params);
  }

  if (provider === 'gemini') {
    // Check if API key is present
    if (!env.GEMINI_API_KEY || env.GEMINI_API_KEY === 'your_gemini_api_key_here' || env.GEMINI_API_KEY.trim() === '') {
      const err = new Error(
        'Gemini API Key is not configured. Please add your GEMINI_API_KEY in the .env file (obtainable free from https://aistudio.google.com/app/apikey). Alternatively, you can run offline demonstration mode by setting AI_PROVIDER=mock in your .env file.'
      );
      err.code = 'GEMINI_KEY_NOT_CONFIGURED';
      err.status = 400;
      throw err;
    }

    try {
      return await analyzeWithGemini(params);
    } catch (err) {
      logger.error(`AI analysis failed: ${err.message}`, { code: err.code });
      throw err;
    }
  }

  throw new Error(`Unsupported AI Provider: ${provider}. Supported values are "gemini" and "mock".`);
}

module.exports = {
  performSkillGapAnalysis
};
