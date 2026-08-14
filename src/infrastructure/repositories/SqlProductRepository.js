const IProductRepository = require('../../domain/repositories/IProductRepository');
const Product = require('../../domain/entities/Product');
const { getConnection } = require('../database/connection');

class SqlProductRepository extends IProductRepository {
  async create(product) {
    const db = await getConnection();
    const result = await db.run(
      `INSERT INTO products (name, description, price, stock, category, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [product.name, product.description, product.price, product.stock, 
       product.category, product.createdAt, product.updatedAt]
    );
    return new Product({ ...product, id: result.lastID });
  }

  async findById(id) {
    const db = await getConnection();
    const row = await db.get('SELECT * FROM products WHERE id = ?', [id]);
    return row ? this._toEntity(row) : null;
  }

  async findAll(filters = {}) {
    const db = await getConnection();
    let query = 'SELECT * FROM products WHERE 1=1';
    const params = [];

    if (filters.ids && filters.ids.length > 0) {
      query += ` AND id IN (${filters.ids.map(() => '?').join(',')})`;
      params.push(...filters.ids);
    }
    if (filters.category) {
      query += ' AND category = ?';
      params.push(filters.category);
    }
    if (filters.minPrice) {
      query += ' AND price >= ?';
      params.push(filters.minPrice);
    }
    if (filters.maxPrice) {
      query += ' AND price <= ?';
      params.push(filters.maxPrice);
    }

    query += ' ORDER BY created_at DESC';
    const rows = await db.all(query, params);
    return rows.map(r => this._toEntity(r));
  }

  async update(product) {
    const db = await getConnection();
    await db.run(
      `UPDATE products SET name = ?, description = ?, price = ?, stock = ?, 
       category = ?, updated_at = ? WHERE id = ?`,
      [product.name, product.description, product.price, product.stock,
       product.category, product.updatedAt, product.id]
    );
    return product;
  }

  async delete(id) {
    const db = await getConnection();
    await db.run('DELETE FROM products WHERE id = ?', [id]);
  }

  async updateStock(id, quantity) {
    const db = await getConnection();
    await db.run('UPDATE products SET stock = stock + ? WHERE id = ?', [quantity, id]);
  }

  _toEntity(row) {
    return new Product({
      id: row.id,
      name: row.name,
      description: row.description,
      price: row.price,
      stock: row.stock,
      category: row.category,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at)
    });
  }
}

module.exports = SqlProductRepository;