const express = require('express');
const { protect } = require('../middlewares/authMiddleware');
const {
  getUserProfile,
  updateUserProfile,
  changePassword,
} = require('../controllers/userController');

const router = express.Router();

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.put('/password', protect, changePassword);

module.exports = router;
