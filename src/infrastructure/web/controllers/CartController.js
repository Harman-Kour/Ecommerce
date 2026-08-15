const AddToCartDTO = require('../../../application/dto/AddToCartDTO');

class CartController {
  constructor(addToCart, getCart, clearCart) {
    this.addToCart = addToCart;
    this.getCartUseCase = getCart;
    this.clearCart = clearCart;
  }

  addItem = async (req, res, next) => {
    try {
      const dto = new AddToCartDTO(req.body);
      const cart = await this.addToCart.execute(dto);
      res.json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  };

  getCart = async (req, res, next) => {
    try {
      const cart = await this.getCartUseCase.execute(Number(req.params.userId));
      res.json({ success: true, data: cart });
    } catch (error) {
      next(error);
    }
  };

  clear = async (req, res, next) => {
    try {
      const result = await this.clearCart.execute(Number(req.params.userId));
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = CartController;
