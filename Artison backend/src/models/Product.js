const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  salePrice: {
    type: Number,
    min: [0, 'Sale price cannot be negative']
  },
  sku: {
    type: String,
    trim: true,
  },
  dimensions: {
    type: String,
    trim: true,
  },
  creationYear: {
    type: String,
    trim: true,
  },
  weight: {
    type: Number,
  },
  shippingClass: {
    type: String,
    trim: true,
  },
  packaging: {
    type: String,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: [true, 'Category is required']
  },
  subCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubCategory',
    required: [true, 'SubCategory is required']
  },
  image: {
    type: String, // Single display image
  },
  gallery: [{
    type: String, // Multiple gallery images
  }],
  tags: [{
    type: String,
    enum: ['Featured', 'Hand-picked', 'Trending']
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  reviews: [reviewSchema],
  rating: {
    type: Number,
    default: 0
  },
  numReviews: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('Product', productSchema);
