const express = require('express');
const requestValidator = require('../middleware/requestValidator');

module.exports = (productController) => {
  const router = express.Router();

  router.post(
    '/',
    requestValidator({
      body: {
        name: { required: true },
        price: { required: true, type: 'number', min: 0 },
        stock: { required: true, type: 'number', min: 0 }
      }
    }),
    productController.create
  );

  router.get('/', productController.list);
  router.get('/:id', productController.getById);
  router.put('/:id', productController.update);
  router.delete('/:id', productController.remove);

  return router;
};