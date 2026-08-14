class Product {
  constructor({ id, name, description, price, stock, category, createdAt, updatedAt }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.stock = stock;
    this.category = category;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  isInStock(quantity = 1) {
    return this.stock >= quantity;
  }

  decreaseStock(quantity) {
    if (!this.isInStock(quantity)) {
      throw new Error('Insufficient stock');
    }
    this.stock -= quantity;
    this.updatedAt = new Date();
  }

  increaseStock(quantity) {
    this.stock += quantity;
    this.updatedAt = new Date();
  }

  updatePrice(newPrice) {
    if (newPrice < 0) throw new Error('Price cannot be negative');
    this.price = newPrice;
    this.updatedAt = new Date();
  }
}

module.exports = Product;