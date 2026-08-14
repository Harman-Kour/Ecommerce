class ClearCartUseCase {
  constructor(cartRepository) {
    this.cartRepository = cartRepository;
  }

  async execute(userId) {
    await this.cartRepository.clear(userId);
    return { cleared: true };
  }
}

module.exports = ClearCartUseCase;