class ListOrdersUseCase {
  constructor(orderRepository) {
    this.orderRepository = orderRepository;
  }

  async execute(userId) {
    if (userId) {
      return await this.orderRepository.findByUserId(userId);
    }
    return await this.orderRepository.findAll();
  }
}

module.exports = ListOrdersUseCase;