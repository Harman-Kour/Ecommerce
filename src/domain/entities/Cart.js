class CartItem {
  constructor({ productId, quantity }) {
    this.productId = productId;
    this.quantity = quantity;
  }
}

class Cart {
  constructor({ id, userId, items }) {
    this.id = id;
    this.userId = userId;
    this.items = items || [];
  }

  addItem(productId, quantity) {
    const existing = this.items.find(i => i.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      this.items.push(new CartItem({ productId, quantity }));
    }
  }

  removeItem(productId) {
    this.items = this.items.filter(i => i.productId !== productId);
  }

  updateQuantity(productId, quantity) {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    const item = this.items.find(i => i.productId === productId);
    if (item) item.quantity = quantity;
  }

  clear() {
    this.items = [];
  }

  getItemCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }
}

module.exports = { Cart, CartItem };