const Joi = require('joi');

const SubCategorySchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'SubCategory name is required',
    'any.required': 'SubCategory name is required'
  }),
  category: Joi.string().required().messages({
    'string.empty': 'Category is required',
    'any.required': 'Category is required'
  }),
  description: Joi.string().allow('').optional(),
  image: Joi.string().allow('').optional(),
  url: Joi.string().uri().allow('').optional().messages({
    'string.uri': 'Must be a valid URL'
  }),
  isActive: Joi.boolean().optional()
});

module.exports = { SubCategorySchema };
