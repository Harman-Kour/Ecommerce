const fs = require('fs').promises;
const path = require('path');
const { getConnection } = require('./connection');

async function runMigrations() {
  const db = await getConnection();
  const schema = await fs.readFile(
    path.join(__dirname, 'schema.sql'), 
    'utf-8'
  );
  
  const statements = schema.split(';').filter(s => s.trim());
  for (const statement of statements) {
    await db.exec(statement);
  }
  console.log('✅ Database migrations completed');
}

module.exports = { runMigrations };