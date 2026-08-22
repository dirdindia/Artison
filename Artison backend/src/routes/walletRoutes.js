const express = require('express');
const { protect, protectAdmin } = require('../middlewares/authMiddleware');
const { 
  getWallet,
  requestPayout,
  updateBankDetails,
  getAllPayouts,
  updatePayoutStatus
} = require('../controllers/walletController');

const router = express.Router();

// Artist routes
router.route('/').get(protect, getWallet);
router.route('/payout').post(protect, requestPayout);
router.route('/bank').put(protect, updateBankDetails);

// Admin routes
router.route('/payouts').get(protect, protectAdmin, getAllPayouts);
router.route('/payouts/:id').put(protect, protectAdmin, updatePayoutStatus);

module.exports = router;
