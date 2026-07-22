const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  // General
  storeName: {
    type: String,
    default: 'kalakosh',
  },
  supportEmail: {
    type: String,
    default: 'support@kalakosh.com',
  },
  contactPhone: {
    type: String,
    default: '+91 98765 43210',
  },
  businessAddress: {
    type: String,
    default: '123 Creative Street, Arts District\nMumbai, Maharashtra 400001',
  },
  // Payments & Tax
  defaultCurrency: {
    type: String,
    default: 'INR',
  },
  taxRate: {
    type: Number,
    default: 18,
  },
  // Notifications
  newOrdersAlert: {
    type: Boolean,
    default: true,
  },
  lowStockAlert: {
    type: Boolean,
    default: true,
  },
  newReviewAlert: {
    type: Boolean,
    default: false,
  }
}, { timestamps: true });

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
