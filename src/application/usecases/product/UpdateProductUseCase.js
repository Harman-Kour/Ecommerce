class UpdateProductUseCase {
  constructor(productRepository) {
    this.productRepository = productRepository;
  }

  async execute(id, updates) {
    const product = await this.productRepository.findById(id);
    if (!product) throw new Error('Product not found');

    if (updates.name) product.name = updates.name;
    if (updates.description) product.description = updates.description;
    if (updates.price !== undefined) product.updatePrice(updates.price);
    if (updates.stock !== undefined) product.stock = updates.stock;
    if (updates.category) product.category = updates.category;

    return await this.productRepository.update(product);
  }
}

module.exports = UpdateProductUseCase;