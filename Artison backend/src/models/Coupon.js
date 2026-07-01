const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    discountType: {
      type: String,
      required: [true, 'Discount type is required'],
      enum: ['percentage', 'fixed', 'freeship'],
    },
    discountValue: {
      type: Number,
      required: function() {
        return this.discountType !== 'freeship';
      },
      min: 0,
    },
    minSpend: {
      type: Number,
      default: 0,
    },
    expiryDate: {
      type: Date,
      required: [true, 'Expiry date is required'],
    },
    usageLimit: {
      type: String,
      enum: ['unlimited', 'once_per_user', 'total_limit'],
      default: 'unlimited',
    },
    applicability: {
      type: String,
      enum: ['all', 'products', 'categories'],
      default: 'all',
    },
    selectedProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    selectedCategories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Coupon', couponSchema);
