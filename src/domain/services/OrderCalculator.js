// Domain Service - pure business logic, no DB access
class OrderCalculator {
  static calculateTotal(items) {
    return items.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  }

  static applyTax(amount, taxRate = 0.1) {
    return amount + (amount * taxRate);
  }

  static validateOrderItems(items, productsMap) {
    for (const item of items) {
      const product = productsMap.get(item.productId);
      if (!product) throw new Error(`Product ${item.productId} not found`);
      if (!product.isInStock(item.quantity)) {
        throw new Error(`Insufficient stock for ${product.name}`);
      }
    }
  }
}

module.exports = OrderCalculator;