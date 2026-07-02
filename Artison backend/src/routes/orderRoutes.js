const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const { getMyOrders } = require('../controllers/orderController');

const router = express.Router();

router.route('/myorders').get(protect, getMyOrders);

module.exports = router;
