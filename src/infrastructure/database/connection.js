const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');
const logger = require('../logger');

let db = null;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

async function getConnection() {
  if (db) {
    return db;
  }

  let lastError;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      logger.info(`Connecting to database (attempt ${attempt}/${MAX_RETRIES})`);
      db = await open({
        filename: path.join(process.cwd(), 'ecommerce.db'),
        driver: sqlite3.Database
      });
      
      // Enable foreign keys
      await db.exec('PRAGMA foreign_keys = ON');
      
      logger.info('Database connection established');
      return db;
    } catch (error) {
      lastError = error;
      logger.warn(`Database connection failed on attempt ${attempt}: ${error.message}`);
      
      if (attempt < MAX_RETRIES) {
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY * attempt));
      }
    }
  }

  logger.error('Failed to connect to database after retries');
  throw lastError;
}

module.exports = { getConnection };