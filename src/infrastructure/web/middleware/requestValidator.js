const { AppError } = require('./errorHandler');

const requestValidator = (schema) => {
  return (req, res, next) => {
    const errors = [];
    
    if (schema.body) {
      for (const [field, rules] of Object.entries(schema.body)) {
        const value = req.body[field];
        
        if (rules.required && (value === undefined || value === null || value === '')) {
          errors.push(`${field} is required`);
          continue;
        }
        
        if (value !== undefined) {
          if (rules.type === 'number' && typeof value !== 'number') {
            errors.push(`${field} must be a number`);
          }
          if (rules.min !== undefined && value < rules.min) {
            errors.push(`${field} must be at least ${rules.min}`);
          }
          if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errors.push(`${field} must be a valid email`);
          }
        }
      }
    }

    if (errors.length > 0) {
      return next(new AppError(errors.join(', '), 400));
    }
    
    next();
  };
};

module.exports = requestValidator;