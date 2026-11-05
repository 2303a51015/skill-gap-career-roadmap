const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');
const env = require('../config/env');
const logger = require('../utils/logger');

let dbInstance = null;

function getDb(customPath = null) {
  if (dbInstance && !customPath) {
    return dbInstance;
  }

  const dbPath = customPath || env.DATABASE_PATH;
  const isMemory = dbPath === ':memory:';

  if (!isMemory) {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  logger.info(`Initializing SQLite database at: ${dbPath}`);
  const db = new DatabaseSync(dbPath);

  // Enable foreign keys and WAL mode for better concurrency in local development
  try {
    db.exec('PRAGMA foreign_keys = ON;');
    if (!isMemory) {
      db.exec('PRAGMA journal_mode = WAL;');
    }
  } catch (err) {
    logger.warn(`Could not set pragmas: ${err.message}`);
  }

  // Initialize schema
  const schemaPath = path.resolve(__dirname, 'schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    db.exec(schemaSql);
  }

  if (!customPath) {
    dbInstance = db;
  }

  return db;
}

const db = {
  getInstance: () => getDb(),
  
  query: (sql, params = []) => {
    const database = getDb();
    const stmt = database.prepare(sql);
    return stmt.all(...params);
  },

  get: (sql, params = []) => {
    const database = getDb();
    const stmt = database.prepare(sql);
    return stmt.get(...params) || null;
  },

  run: (sql, params = []) => {
    const database = getDb();
    const stmt = database.prepare(sql);
    return stmt.run(...params);
  },

  exec: (sql) => {
    const database = getDb();
    return database.exec(sql);
  },

  close: () => {
    if (dbInstance) {
      try {
        dbInstance.close();
      } catch (err) {
        logger.warn(`Error closing DB: ${err.message}`);
      }
      dbInstance = null;
    }
  }
};

module.exports = db;
