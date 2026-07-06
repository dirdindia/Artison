const Joi = require('joi');

const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow('').optional(),
  price: Joi.number().min(0).required(),
  salePrice: Joi.number().min(0).allow(null, '').optional(),
  stock: Joi.number().min(0).allow(null, '').optional(),
  sku: Joi.string().allow('').optional(),
  dimensions: Joi.string().allow('').optional(),
  creationYear: Joi.string().allow('').optional(),
  weight: Joi.number().allow(null, '').optional(),
  shippingClass: Joi.string().allow('').optional(),
  packaging: Joi.string().allow('').optional(),
  category: Joi.string().required(),
  subCategory: Joi.string().required(),
  image: Joi.string().allow('').optional(),
  gallery: Joi.array().items(Joi.string()).optional(),
  isActive: Joi.boolean().optional()
});

module.exports = { productSchema };
