const Settings = require('../models/Settings');

// @desc    Get settings
// @route   GET /api/settings
// @access  Private/Admin
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }

    settings.storeName = req.body.storeName !== undefined ? req.body.storeName : settings.storeName;
    settings.supportEmail = req.body.supportEmail !== undefined ? req.body.supportEmail : settings.supportEmail;
    settings.contactPhone = req.body.contactPhone !== undefined ? req.body.contactPhone : settings.contactPhone;
    settings.businessAddress = req.body.businessAddress !== undefined ? req.body.businessAddress : settings.businessAddress;
    
    settings.defaultCurrency = req.body.defaultCurrency !== undefined ? req.body.defaultCurrency : settings.defaultCurrency;
    settings.taxRate = req.body.taxRate !== undefined ? req.body.taxRate : settings.taxRate;
    
    settings.newOrdersAlert = req.body.newOrdersAlert !== undefined ? req.body.newOrdersAlert : settings.newOrdersAlert;
    settings.lowStockAlert = req.body.lowStockAlert !== undefined ? req.body.lowStockAlert : settings.lowStockAlert;
    settings.newReviewAlert = req.body.newReviewAlert !== undefined ? req.body.newReviewAlert : settings.newReviewAlert;

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSettings,
  updateSettings
};
