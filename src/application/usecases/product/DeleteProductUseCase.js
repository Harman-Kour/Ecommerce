class DeleteProductUseCase {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(id) {
    const product = await this.productRepository.findById(id);
    if (!product) throw new Error('Product not found');
    await this.productRepository.delete(id);
    return { deleted: true };
  }
}

module.exports = DeleteProductUseCase;