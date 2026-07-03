const express = require('express');
const { protect, protectAdmin } = require('../middlewares/authMiddleware');
const {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getAllCustomers,
} = require('../controllers/userController');

const router = express.Router();

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.put('/password', protect, changePassword);

// Admin routes
router.get('/', protect, protectAdmin, getAllCustomers);

module.exports = router;
