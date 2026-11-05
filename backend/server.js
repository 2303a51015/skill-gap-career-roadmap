const app = require('./src/app');
const env = require('./src/config/env');
const db = require('./src/database/connection');
const logger = require('./src/utils/logger');

// Ensure database is initialized
try {
  db.getInstance();
  logger.info('Database connection established successfully.');
} catch (err) {
  logger.error(`Database initialization failure: ${err.message}`);
  process.exit(1);
}

const server = app.listen(env.PORT, () => {
  logger.info(`=======================================================`);
  logger.info(`Skill Gap & Career Roadmap API Server`);
  logger.info(`Status: Running on port ${env.PORT}`);
  logger.info(`Health check: http://localhost:${env.PORT}/api/health`);
  logger.info(`Environment: ${env.NODE_ENV}`);
  logger.info(`AI Provider: ${env.AI_PROVIDER}`);
  logger.info(`Database: ${env.DATABASE_PATH}`);
  logger.info(`=======================================================`);
});

// Graceful shutdown handling
function handleShutdown(signal) {
  logger.info(`Received ${signal}. Gracefully closing HTTP server and database...`);
  server.close(() => {
    db.close();
    logger.info('Server and SQLite connection safely closed.');
    process.exit(0);
  });

  setTimeout(() => {
    logger.error('Forceful shutdown timeout exceeded.');
    process.exit(1);
  }, 5000);
}

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));
