class GetCartUseCase {
  constructor(cartRepository, productRepository) {
    this.cartRepository = cartRepository;
    this.productRepository = productRepository;
  }

  async execute(userId) {
    const cart = await this.cartRepository.findByUserId(userId);
    if (!cart) return { items: [], total: 0 };

    // Enrich with product details
    const productIds = cart.items.map(i => i.productId);
    const products = await this.productRepository.findAll({ ids: productIds });
    const productsMap = new Map(products.map(p => [p.id, p]));

    const enrichedItems = cart.items.map(item => ({
      ...item,
      product: productsMap.get(item.productId)
    }));

    const total = enrichedItems.reduce((sum, item) => 
      sum + (item.quantity * (item.product?.price || 0)), 0
    );

    return { items: enrichedItems, total };
  }
}

module.exports = GetCartUseCase;