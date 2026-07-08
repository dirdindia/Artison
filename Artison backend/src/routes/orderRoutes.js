const express = require('express');
const { protect, protectAdmin, optionalProtect } = require('../middlewares/authMiddleware');
const { 
  getMyOrders, 
  createRazorpayOrder, 
  verifyOrderPayment, 
  razorpayWebhook,
  getAllOrders,
  updateOrderStatus,
  markOrderAsViewed,
  getOrdersByUser
} = require('../controllers/orderController');

const router = express.Router();

router.route('/').get(protect, protectAdmin, getAllOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/razorpay').post(optionalProtect, createRazorpayOrder);
router.route('/verify').post(optionalProtect, verifyOrderPayment);
router.route('/:id/status').put(protect, protectAdmin, updateOrderStatus);
router.route('/:id/mark-viewed').put(protect, protectAdmin, markOrderAsViewed);
router.route('/user/:userId').get(protect, protectAdmin, getOrdersByUser);
router.route('/webhook').post(razorpayWebhook); // no protect, razorpay hits this directly

module.exports = router;
