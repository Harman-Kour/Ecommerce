const express = require('express');
const requestValidator = require('../middleware/requestValidator');

module.exports = (userController) => {
  const router = express.Router();

  router.post(
    '/',
    requestValidator({
      body: {
        email: { required: true, email: true },
        password: { required: true, min: 6 },
        name: { required: true }
      }
    }),
    userController.register
  );

  router.get('/', userController.list);
  router.get('/:id', userController.getById);

  return router;
};