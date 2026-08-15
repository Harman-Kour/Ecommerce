const { AppError } = require('./errorHandler');
const logger = require('../../logger');

const requestValidator = (schema) => {
  return (req, res, next) => {
    const errors = [];
    
    if (schema.body) {
      for (const [field, rules] of Object.entries(schema.body)) {
        const value = req.body[field];
        
        // Check required field
        if (rules.required && (value === undefined || value === null || value === '')) {
          errors.push(`${field} is required`);
          continue;
        }
        
        // Skip further validation if field is not provided and not required
        if (value === undefined || value === null) {
          continue;
        }

        // Type validation
        if (rules.type === 'string' && typeof value !== 'string') {
          errors.push(`${field} must be a string`);
          continue;
        }
        if (rules.type === 'number' && typeof value !== 'number') {
          errors.push(`${field} must be a number`);
          continue;
        }
        if (rules.type === 'array' && !Array.isArray(value)) {
          errors.push(`${field} must be an array`);
          continue;
        }
        if (rules.type === 'object' && typeof value !== 'object') {
          errors.push(`${field} must be an object`);
          continue;
        }

        // String validations
        if (typeof value === 'string') {
          if (rules.minLength && value.length < rules.minLength) {
            errors.push(`${field} must be at least ${rules.minLength} characters`);
          }
          if (rules.maxLength && value.length > rules.maxLength) {
            errors.push(`${field} must be at most ${rules.maxLength} characters`);
          }
          if (rules.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            errors.push(`${field} must be a valid email`);
          }
        }

        // Number validations
        if (typeof value === 'number') {
          if (rules.min !== undefined && value < rules.min) {
            errors.push(`${field} must be at least ${rules.min}`);
          }
          if (rules.max !== undefined && value > rules.max) {
            errors.push(`${field} must be at most ${rules.max}`);
          }
          if (rules.isInteger && !Number.isInteger(value)) {
            errors.push(`${field} must be an integer`);
          }
        }

        // Array validations
        if (Array.isArray(value)) {
          if (rules.minLength && value.length < rules.minLength) {
            errors.push(`${field} must have at least ${rules.minLength} items`);
          }
          if (rules.maxLength && value.length > rules.maxLength) {
            errors.push(`${field} must have at most ${rules.maxLength} items`);
          }
        }
      }
    }

    if (errors.length > 0) {
      logger.warn(`Validation errors for ${req.method} ${req.path}:`, errors);
      return next(new AppError(errors.join('; '), 400));
    }
    
    next();
  };
};

module.exports = requestValidator;