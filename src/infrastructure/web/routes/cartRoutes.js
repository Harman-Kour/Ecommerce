const express = require('express');
const requestValidator = require('../middleware/requestValidator');

module.exports = (cartController) => {
  const router = express.Router();

  router.post(
    '/add',
    requestValidator({
      body: {
        userId: { required: true, type: 'number' },
        productId: { required: true, type: 'number' },
        quantity: { required: true, type: 'number', min: 1 }
      }
    }),
    cartController.addItem
  );

  router.get('/:userId', cartController.getCart);
  router.delete('/:userId', cartController.clear);

  return router;
};