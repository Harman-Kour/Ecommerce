const Product = require('../../../domain/entities/Product');

class CreateProductUseCase {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(dto) {
    const product = new Product(dto);
    return await this.productRepository.create(product);
  }
}

module.exports = CreateProductUseCase;