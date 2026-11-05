const env = require('../config/env');

const levels = {
  DEBUG: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3
};

const currentLevel = env.NODE_ENV === 'test' ? levels.ERROR : levels.DEBUG;

function formatMessage(level, message, meta) {
  const timestamp = new Date().toISOString();
  let metaStr = '';
  if (meta) {
    // Sanitize any potential PII or large text payloads
    const sanitized = { ...meta };
    if (sanitized.resumeText) sanitized.resumeText = `[REDACTED: ${sanitized.resumeText.length} chars]`;
    if (sanitized.jobDescription && sanitized.jobDescription.length > 100) {
      sanitized.jobDescription = `[TRUNCATED: ${sanitized.jobDescription.length} chars]`;
    }
    metaStr = ` ${JSON.stringify(sanitized)}`;
  }
  return `[${timestamp}] [${level}] ${message}${metaStr}`;
}

const logger = {
  debug: (msg, meta) => {
    if (currentLevel <= levels.DEBUG) console.debug(formatMessage('DEBUG', msg, meta));
  },
  info: (msg, meta) => {
    if (currentLevel <= levels.INFO) console.log(formatMessage('INFO', msg, meta));
  },
  warn: (msg, meta) => {
    if (currentLevel <= levels.WARN) console.warn(formatMessage('WARN', msg, meta));
  },
  error: (msg, meta) => {
    if (currentLevel <= levels.ERROR) console.error(formatMessage('ERROR', msg, meta));
  }
};

module.exports = logger;
