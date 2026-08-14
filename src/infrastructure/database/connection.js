const sqlite3 = require('sqlite3').verbose();
const { open } = require('sqlite');
const path = require('path');

let db = null;

async function getConnection() {
  if (!db) {
    db = await open({
      filename: path.join(process.cwd(), 'ecommerce.db'),
      driver: sqlite3.Database
    });
  }
  return db;
}

module.exports = { getConnection };