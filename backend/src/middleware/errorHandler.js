const { ZodError } = require('zod');
const multer = require('multer');
const logger = require('../utils/logger');
const { safeUnlink } = require('../services/textExtractor');

function errorHandler(err, req, res, next) {
  // If an uploaded file exists during an error, clean it up
  if (req.file && req.file.path) {
    safeUnlink(req.file.path);
  }
  if (req.files) {
    if (Array.isArray(req.files)) {
      req.files.forEach((f) => safeUnlink(f.path));
    } else {
      Object.values(req.files).forEach((files) => files.forEach((f) => safeUnlink(f.path)));
    }
  }

  logger.error(`API Error: ${err.message}`, {
    path: req.originalUrl,
    method: req.method,
    code: err.code
  });

  // Handle Multer upload errors
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        error: {
          code: 'FILE_TOO_LARGE',
          message: 'Uploaded file exceeds the maximum allowed limit of 5MB.'
        }
      });
    }
    return res.status(400).json({
      success: false,
      error: {
        code: 'UPLOAD_ERROR',
        message: err.message
      }
    });
  }

  // Handle Zod Schema Validation errors
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message
    }));

    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request payload validation failed.',
        details: formattedErrors
      }
    });
  }

  // Handle Gemini API Configuration errors
  if (err.code === 'GEMINI_KEY_NOT_CONFIGURED') {
    return res.status(400).json({
      success: false,
      error: {
        code: 'GEMINI_KEY_NOT_CONFIGURED',
        message: err.message,
        helpUrl: 'https://aistudio.google.com/app/apikey'
      }
    });
  }

  // Handle Gemini API Key Invalid
  if (err.code === 'GEMINI_API_KEY_INVALID') {
    return res.status(401).json({
      success: false,
      error: {
        code: 'GEMINI_API_KEY_INVALID',
        message: err.message
      }
    });
  }

  // Handle Rate Limiting / Quota
  if (err.code === 'GEMINI_QUOTA_EXCEEDED') {
    return res.status(429).json({
      success: false,
      error: {
        code: 'GEMINI_QUOTA_EXCEEDED',
        message: err.message
      }
    });
  }

  // Generic client or server error
  const status = err.status || err.statusCode || 500;
  const message =
    status >= 500 && process.env.NODE_ENV === 'production'
      ? 'An unexpected internal server error occurred while processing your analysis.'
      : err.message || 'An error occurred';

  return res.status(status).json({
    success: false,
    error: {
      code: err.code || 'INTERNAL_ERROR',
      message
    }
  });
}

module.exports = errorHandler;
