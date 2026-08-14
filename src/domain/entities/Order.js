class OrderItem {
  constructor({ productId, quantity, unitPrice }) {
    this.productId = productId;
    this.quantity = quantity;
    this.unitPrice = unitPrice;
  }

  getSubtotal() {
    return this.quantity * this.unitPrice;
  }
}

class Order {
  static STATUS = {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
  };

  constructor({ id, userId, items, status, totalAmount, createdAt }) {
    this.id = id;
    this.userId = userId;
    this.items = items || []; // Array of OrderItem
    this.status = status || Order.STATUS.PENDING;
    this.totalAmount = totalAmount || 0;
    this.createdAt = createdAt || new Date();
  }

  addItem(productId, quantity, unitPrice) {
    const existingItem = this.items.find(i => i.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push(new OrderItem({ productId, quantity, unitPrice }));
    }
    this.recalculateTotal();
  }

  recalculateTotal() {
    this.totalAmount = this.items.reduce((sum, item) => sum + item.getSubtotal(), 0);
  }

  confirm() {
    if (this.status !== Order.STATUS.PENDING) {
      throw new Error('Only pending orders can be confirmed');
    }
    this.status = Order.STATUS.CONFIRMED;
  }

  cancel() {
    if (this.status === Order.STATUS.DELIVERED) {
      throw new Error('Cannot cancel delivered order');
    }
    this.status = Order.STATUS.CANCELLED;
  }
}

module.exports = { Order, OrderItem };