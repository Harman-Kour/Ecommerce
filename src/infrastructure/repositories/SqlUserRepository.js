const IUserRepository = require('../../domain/repositories/IUserRepository');
const User = require('../../domain/entities/User');
const { getConnection } = require('../database/connection');

class SqlUserRepository extends IUserRepository {
  async create(user) {
    const db = await getConnection();
    const result = await db.run(
      `INSERT INTO users (email, password_hash, name, role, created_at) 
       VALUES (?, ?, ?, ?, ?)`,
      [user.email, user.passwordHash, user.name, user.role, user.createdAt]
    );
    return new User({ ...user, id: result.lastID });
  }

  async findById(id) {
    const db = await getConnection();
    const row = await db.get('SELECT * FROM users WHERE id = ?', [id]);
    return row ? this._toEntity(row) : null;
  }

  async findByEmail(email) {
    const db = await getConnection();
    const row = await db.get('SELECT * FROM users WHERE email = ?', [email]);
    return row ? this._toEntity(row) : null;
  }

  async findAll() {
    const db = await getConnection();
    const rows = await db.all('SELECT * FROM users ORDER BY created_at DESC');
    return rows.map(r => this._toEntity(r));
  }

  async update(user) {
    const db = await getConnection();
    await db.run(
      `UPDATE users SET email = ?, name = ?, role = ? WHERE id = ?`,
      [user.email, user.name, user.role, user.id]
    );
    return user;
  }

  async delete(id) {
    const db = await getConnection();
    await db.run('DELETE FROM users WHERE id = ?', [id]);
  }

  _toEntity(row) {
    return new User({
      id: row.id,
      email: row.email,
      passwordHash: row.password_hash,
      name: row.name,
      role: row.role,
      createdAt: new Date(row.created_at)
    });
  }
}

module.exports = SqlUserRepository;