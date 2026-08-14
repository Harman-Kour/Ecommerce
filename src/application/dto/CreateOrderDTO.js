class CreateOrderDTO {
  constructor({ userId, items }) {
    this.userId = userId;
    this.items = items; // [{ productId, quantity }]
  }
}

module.exports = CreateOrderDTO;