class ListProductsUseCase {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(filters = {}) {
    return await this.productRepository.findAll(filters);
  }
}

module.exports = ListProductsUseCase;