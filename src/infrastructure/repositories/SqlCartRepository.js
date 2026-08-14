const ICartRepository = require('../../domain/repositories/ICartRepository');
const { Cart, CartItem } = require('../../domain/entities/Cart');
const { getConnection } = require('../database/connection');

class SqlCartRepository extends ICartRepository {
  async findByUserId(userId) {
    const db = await getConnection();
    const cartRow = await db.get('SELECT * FROM carts WHERE user_id = ?', [userId]);
    
    if (!cartRow) return null;

    const items = await db.all(
      'SELECT * FROM cart_items WHERE cart_id = ?', [cartRow.id]
    );

    return new Cart({
      id: cartRow.id,
      userId: cartRow.user_id,
      items: items.map(i => new CartItem({
        productId: i.product_id,
        quantity: i.quantity
      }))
    });
  }

  async save(cart) {
    const db = await getConnection();
    
    let cartId = cart.id;
    if (!cartId) {
      const result = await db.run(
        'INSERT INTO carts (user_id) VALUES (?)', [cart.userId]
      );
      cartId = result.lastID;
    }

    // Delete existing items and re-insert (simple strategy)
    await db.run('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);

    for (const item of cart.items) {
      await db.run(
        `INSERT INTO cart_items (cart_id, product_id, quantity) 
         VALUES (?, ?, ?)`,
        [cartId, item.productId, item.quantity]
      );
    }

    return new Cart({ ...cart, id: cartId });
  }

  async clear(userId) {
    const db = await getConnection();
    const cart = await db.get('SELECT id FROM carts WHERE user_id = ?', [userId]);
    if (cart) {
      await db.run('DELETE FROM cart_items WHERE cart_id = ?', [cart.id]);
    }
  }
}

module.exports = SqlCartRepository;