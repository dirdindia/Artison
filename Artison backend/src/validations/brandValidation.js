const Joi = require('joi');

const brandSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Brand name is required',
    'any.required': 'Brand name is required'
  }),
  description: Joi.string().allow('').optional(),
  image: Joi.string().allow('').optional(),
  url: Joi.string().uri().allow('').optional().messages({
    'string.uri': 'Must be a valid URL'
  }),
  isActive: Joi.boolean().optional()
});

module.exports = { brandSchema };
