const CreateOrderDTO = require('../../../application/dto/CreateOrderDTO');

class OrderController {
  constructor(createOrder, getOrder, listOrders) {
    this.createOrder = createOrder;
    this.getOrder = getOrder;
    this.listOrders = listOrders;
  }

  create = async (req, res, next) => {
    try {
      const dto = new CreateOrderDTO({
        userId: Number(req.body.userId),
        items: req.body.items
      });
      const order = await this.createOrder.execute(dto);
      res.status(201).json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req, res, next) => {
    try {
      const order = await this.getOrder.execute(Number(req.params.id));
      res.json({ success: true, data: order });
    } catch (error) {
      next(error);
    }
  };

  list = async (req, res, next) => {
    try {
      const orders = await this.listOrders.execute(
        req.query.userId ? Number(req.query.userId) : undefined
      );
      res.json({ success: true, data: orders });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = OrderController;