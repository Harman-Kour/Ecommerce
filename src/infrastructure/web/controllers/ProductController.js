const CreateProductDTO = require('../../../application/dto/CreateProductDTO');

class ProductController {
  constructor(createProduct, getProduct, listProducts, updateProduct, deleteProduct) {
    this.createProduct = createProduct;
    this.getProduct = getProduct;
    this.listProducts = listProducts;
    this.updateProduct = updateProduct;
    this.deleteProduct = deleteProduct;
  }

  create = async (req, res, next) => {
    try {
      const dto = new CreateProductDTO(req.body);
      const product = await this.createProduct.execute(dto);
      res.status(201).json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req, res, next) => {
    try {
      const product = await this.getProduct.execute(Number(req.params.id));
      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  };

  list = async (req, res, next) => {
    try {
      const products = await this.listProducts.execute(req.query);
      res.json({ success: true, data: products });
    } catch (error) {
      next(error);
    }
  };

  update = async (req, res, next) => {
    try {
      const product = await this.updateProduct.execute(Number(req.params.id), req.body);
      res.json({ success: true, data: product });
    } catch (error) {
      next(error);
    }
  };

  remove = async (req, res, next) => {
    try {
      const result = await this.deleteProduct.execute(Number(req.params.id));
      res.json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };
}

module.exports = ProductController;