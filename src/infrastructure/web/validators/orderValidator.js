const orderValidator = {
  body: {
    userId: { required: true, type: 'number', isInteger: true, min: 1 },
    items: { required: true, type: 'array', minLength: 1 },
    deliveryAddress: { required: true, type: 'string', minLength: 5, maxLength: 500 },
    phoneNumber: { required: false, type: 'string', minLength: 10, maxLength: 20 }
  }
};

module.exports = {
  orderValidator
};
