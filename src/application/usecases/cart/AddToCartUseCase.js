const { Cart } = require('../../../domain/entities/Cart');

class AddToCartUseCase {
  constructor(cartRepository, productRepository) {
    this.cartRepository = cartRepository;
    this.productRepository = productRepository;
  }

  async execute(dto) {
    const product = await this.productRepository.findById(dto.productId);
    if (!product) throw new Error('Product not found');
    if (!product.isInStock(dto.quantity)) throw new Error('Insufficient stock');

    let cart = await this.cartRepository.findByUserId(dto.userId);
    if (!cart) {
      cart = new Cart({ userId: dto.userId, items: [] });
    }

    cart.addItem(dto.productId, dto.quantity);
    return await this.cartRepository.save(cart);
  }
}

module.exports = AddToCartUseCase;