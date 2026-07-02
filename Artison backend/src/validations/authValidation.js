const Joi = require('joi');

const signupValidation = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Name is required',
    'any.required': 'Name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please provide a valid email',
    'string.empty': 'Email is required',
    'any.required': 'Email is required',
  }),
  phone: Joi.string().required().messages({
    'string.empty': 'Phone is required',
    'any.required': 'Phone is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters long',
    'string.empty': 'Password is required',
    'any.required': 'Password is required',
  }),
  role: Joi.string().valid('user', 'admin').optional(),
});

module.exports = {
  signupValidation,
};
