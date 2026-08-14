class GetOrderUseCase {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(id) {
    const order = await this.orderRepository.findById(id);
    if (!order) throw new Error('Order not found');
    return order;
  }
}

module.exports = GetOrderUseCase;