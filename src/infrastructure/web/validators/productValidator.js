const productValidator = {
  body: {
    name: { required: true, type: 'string', minLength: 2, maxLength: 100 },
    description: { required: false, type: 'string', maxLength: 500 },
    price: { required: true, type: 'number', min: 0.01, max: 1000000 },
    stock: { required: true, type: 'number', min: 0, isInteger: true },
    category: { required: true, type: 'string', minLength: 2, maxLength: 50 }
  }
};

const productUpdateValidator = {
  body: {
    name: { required: false, type: 'string', minLength: 2, maxLength: 100 },
    description: { required: false, type: 'string', maxLength: 500 },
    price: { required: false, type: 'number', min: 0.01, max: 1000000 },
    stock: { required: false, type: 'number', min: 0, isInteger: true },
    category: { required: false, type: 'string', minLength: 2, maxLength: 50 }
  }
};

module.exports = {
  productValidator,
  productUpdateValidator
};
