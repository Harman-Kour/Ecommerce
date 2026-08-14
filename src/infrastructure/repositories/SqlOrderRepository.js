const IOrderRepository = require('../../domain/repositories/IOrderRepository');
const { Order, OrderItem } = require('../../domain/entities/Order');
const { getConnection } = require('../database/connection');

class SqlOrderRepository extends IOrderRepository {
  async create(order) {
    const db = await getConnection();
    
    const result = await db.run(
      `INSERT INTO orders (user_id, status, total_amount, created_at) 
       VALUES (?, ?, ?, ?)`,
      [order.userId, order.status, order.totalAmount, order.createdAt]
    );

    const orderId = result.lastID;

    for (const item of order.items) {
      await db.run(
        `INSERT INTO order_items (order_id, product_id, quantity, unit_price) 
         VALUES (?, ?, ?, ?)`,
        [orderId, item.productId, item.quantity, item.unitPrice]
      );
    }

    return new Order({ ...order, id: orderId });
  }

  async findById(id) {
    const db = await getConnection();
    const row = await db.get('SELECT * FROM orders WHERE id = ?', [id]);
    if (!row) return null;

    const items = await db.all(
      'SELECT * FROM order_items WHERE order_id = ?', [id]
    );

    return this._toEntity(row, items);
  }

  async findByUserId(userId) {
    const db = await getConnection();
    const rows = await db.all('SELECT * FROM orders WHERE user_id = ?', [userId]);
    
    const orders = [];
    for (const row of rows) {
      const items = await db.all(
        'SELECT * FROM order_items WHERE order_id = ?', [row.id]
      );
      orders.push(this._toEntity(row, items));
    }
    return orders;
  }

  async findAll() {
    const db = await getConnection();
    const rows = await db.all('SELECT * FROM orders ORDER BY created_at DESC');
    
    const orders = [];
    for (const row of rows) {
      const items = await db.all(
        'SELECT * FROM order_items WHERE order_id = ?', [row.id]
      );
      orders.push(this._toEntity(row, items));
    }
    return orders;
  }

  async updateStatus(id, status) {
    const db = await getConnection();
    await db.run('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
  }

  _toEntity(row, items = []) {
    return new Order({
      id: row.id,
      userId: row.user_id,
      status: row.status,
      totalAmount: row.total_amount,
      createdAt: new Date(row.created_at),
      items: items.map(i => new OrderItem({
        productId: i.product_id,
        quantity: i.quantity,
        unitPrice: i.unit_price
      }))
    });
  }
}

module.exports = SqlOrderRepository;