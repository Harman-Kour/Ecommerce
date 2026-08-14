// Repositories
const SqlUserRepository = require('../infrastructure/repositories/SqlUserRepository');
const SqlProductRepository = require('../infrastructure/repositories/SqlProductRepository');
const SqlOrderRepository = require('../infrastructure/repositories/SqlOrderRepository');
const SqlCartRepository = require('../infrastructure/repositories/SqlCartRepository');

// Services
const BcryptPasswordHasher = require('../infrastructure/services/BcryptPasswordHasher');

// Use Cases - User
const RegisterUserUseCase = require('../application/usecases/user/RegisterUserUseCase');
const GetUserUseCase = require('../application/usecases/user/GetUserUseCase');
const ListUsersUseCase = require('../application/usecases/user/ListUsersUseCase');

// Use Cases - Product
const CreateProductUseCase = require('../application/usecases/product/CreateProductUseCase');
const GetProductUseCase = require('../application/usecases/product/GetProductUseCase');
const ListProductsUseCase = require('../application/usecases/product/ListProductsUseCase');
const UpdateProductUseCase = require('../application/usecases/product/UpdateProductUseCase');
const DeleteProductUseCase = require('../application/usecases/product/DeleteProductUseCase');

// Use Cases - Order
const CreateOrderUseCase = require('../application/usecases/order/CreateOrderUseCase');
const GetOrderUseCase = require('../application/usecases/order/GetOrderUseCase');
const ListOrdersUseCase = require('../application/usecases/order/ListOrdersUseCase');

// Use Cases - Cart
const AddToCartUseCase = require('../application/usecases/cart/AddToCartUseCase');
const GetCartUseCase = require('../application/usecases/cart/GetCartUseCase');
const ClearCartUseCase = require('../application/usecases/cart/ClearCartUseCase');

// Controllers
const UserController = require('../infrastructure/web/controllers/UserController');
const ProductController = require('../infrastructure/web/controllers/ProductController');
const OrderController = require('../infrastructure/web/controllers/OrderController');
const CartController = require('../infrastructure/web/controllers/CartController');

// Simple DI Container
class Container {
  constructor() {
    this._instances = new Map();
    this._register();
  }

  _register() {
    // Infrastructure
    const userRepo = new SqlUserRepository();
    const productRepo = new SqlProductRepository();
    const orderRepo = new SqlOrderRepository();
    const cartRepo = new SqlCartRepository();
    const passwordHasher = new BcryptPasswordHasher();

    // User Use Cases
    const registerUser = new RegisterUserUseCase(userRepo, passwordHasher);
    const getUser = new GetUserUseCase(userRepo);
    const listUsers = new ListUsersUseCase(userRepo);

    // Product Use Cases
    const createProduct = new CreateProductUseCase(productRepo);
    const getProduct = new GetProductUseCase(productRepo);
    const listProducts = new ListProductsUseCase(productRepo);
    const updateProduct = new UpdateProductUseCase(productRepo);
    const deleteProduct = new DeleteProductUseCase(productRepo);

    // Order Use Cases
    const createOrder = new CreateOrderUseCase(orderRepo, productRepo, cartRepo);
    const getOrder = new GetOrderUseCase(orderRepo);
    const listOrders = new ListOrdersUseCase(orderRepo);

    // Cart Use Cases
    const addToCart = new AddToCartUseCase(cartRepo, productRepo);
    const getCart = new GetCartUseCase(cartRepo, productRepo);
    const clearCart = new ClearCartUseCase(cartRepo);

    // Controllers
    const userController = new UserController(registerUser, getUser, listUsers);
    const productController = new ProductController(
      createProduct, getProduct, listProducts, updateProduct, deleteProduct
    );
    const orderController = new OrderController(createOrder, getOrder, listOrders);
    const cartController = new CartController(addToCart, getCart, clearCart);

    this._instances.set('userController', userController);
    this._instances.set('productController', productController);
    this._instances.set('orderController', orderController);
    this._instances.set('cartController', cartController);
  }

  get(name) {
    return this._instances.get(name);
  }
}

module.exports = new Container();