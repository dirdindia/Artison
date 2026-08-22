const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      country: { type: String, default: '' },
      postalCode: { type: String, default: '' },
    },
    avatar: {
      type: String,
      default: '',
    },
    walletBalance: {
      type: Number,
      default: 0,
    },
    bankDetails: {
      accountHolderName: { type: String, default: '' },
      accountNumber: { type: String, default: '' },
      ifscCode: { type: String, default: '' },
      upiId: { type: String, default: '' },
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'subadmin', 'artist'],
      default: 'user',
    },
    bio: {
      type: String,
      default: '',
    },
    artCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
    },
    artSubcategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'SubCategory',
    },
    portfolioUrl: {
      type: String,
      default: '',
    },
    instagramHandle: {
      type: String,
      default: '',
    },
    otp: {
      type: String,
    },
    otpExpiresAt: {
      type: Date,
    },
    hasSetPassword: {
      type: Boolean,
      default: true,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
