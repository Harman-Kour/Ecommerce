const userValidator = {
  body: {
    name: { required: true, type: 'string', minLength: 2, maxLength: 100 },
    email: { required: true, type: 'string', email: true, maxLength: 100 },
    password: { required: true, type: 'string', minLength: 8, maxLength: 100 },
    phone: { required: false, type: 'string', minLength: 10, maxLength: 20 },
    address: { required: false, type: 'string', maxLength: 500 }
  }
};

const userUpdateValidator = {
  body: {
    name: { required: false, type: 'string', minLength: 2, maxLength: 100 },
    email: { required: false, type: 'string', email: true, maxLength: 100 },
    phone: { required: false, type: 'string', minLength: 10, maxLength: 20 },
    address: { required: false, type: 'string', maxLength: 500 }
  }
};

module.exports = {
  userValidator,
  userUpdateValidator
};
