const { Order } = require('../../../domain/entities/Order');
const OrderCalculator = require('../../../domain/services/OrderCalculator');

class CreateOrderUseCase {
  constructor(orderRepository, productRepository, cartRepository) {
    this.orderRepository = orderRepository;
    this.productRepository = productRepository;
    this.cartRepository = cartRepository;
  }

  async execute(dto) {
    // Fetch products to validate stock and get prices
    const productIds = dto.items.map(i => i.productId);
    const products = await this.productRepository.findAll({ ids: productIds });
    const productsMap = new Map(products.map(p => [p.id, p]));

    // Validate using domain service
    OrderCalculator.validateOrderItems(dto.items, productsMap);

    // Create order
    const order = new Order({ userId: dto.userId, items: [] });
    
    for (const item of dto.items) {
      const product = productsMap.get(item.productId);
      order.addItem(item.productId, item.quantity, product.price);
      product.decreaseStock(item.quantity);
      await this.productRepository.update(product);
    }

    const savedOrder = await this.orderRepository.create(order);
    
    // Clear cart after order
    await this.cartRepository.clear(dto.userId);

    return savedOrder;
  }
}

module.exports = CreateOrderUseCase;