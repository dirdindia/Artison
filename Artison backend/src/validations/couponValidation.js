const Joi = require('joi');

const couponSchema = Joi.object({
  code: Joi.string().required().messages({
    'string.empty': 'Coupon code is required',
    'any.required': 'Coupon code is required'
  }),
  discountType: Joi.string().valid('percentage', 'fixed', 'freeship').required().messages({
    'any.only': 'Discount type must be one of: percentage, fixed, freeship',
    'any.required': 'Discount type is required'
  }),
  discountValue: Joi.number().min(0).when('discountType', {
    is: 'freeship',
    then: Joi.optional(),
    otherwise: Joi.required().messages({
      'any.required': 'Discount value is required for this discount type'
    })
  }),
  minSpend: Joi.number().min(0).optional().default(0),
  expiryDate: Joi.date().required().messages({
    'any.required': 'Expiry date is required',
    'date.base': 'Invalid date format'
  }),
  usageLimit: Joi.string().valid('unlimited', 'once_per_user', 'total_limit').optional().default('unlimited'),
  applicability: Joi.string().valid('all', 'products', 'categories').optional().default('all'),
  selectedProducts: Joi.array().items(Joi.string()).when('applicability', {
    is: 'products',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  selectedCategories: Joi.array().items(Joi.string()).when('applicability', {
    is: 'categories',
    then: Joi.required(),
    otherwise: Joi.optional()
  }),
  isActive: Joi.boolean().optional().default(true)
});

module.exports = { couponSchema };
