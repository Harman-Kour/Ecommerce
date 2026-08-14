const express = require('express');
const requestValidator = require('../middleware/requestValidator');

module.exports = (orderController) => {
  const router = express.Router();

  router.post(
    '/',
    requestValidator({
      body: {
        userId: { required: true, type: 'number' },
        items: { required: true }
      }
    }),
    orderController.create
  );

  router.get('/', orderController.list);
  router.get('/:id', orderController.getById);

  return router;
};