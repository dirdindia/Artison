const express = require('express');
const { protect, protectAdmin } = require('../middlewares/authMiddleware');
const {
  getUserProfile,
  updateUserProfile,
  changePassword,
  getAllCustomers,
  getAllArtists,
  toggleArtistApproval,
} = require('../controllers/userController');

const router = express.Router();

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.put('/password', protect, changePassword);

// Admin routes
router.get('/', protect, protectAdmin, getAllCustomers);
router.get('/artists', protect, protectAdmin, getAllArtists);
router.put('/artists/:id/approve', protect, protectAdmin, toggleArtistApproval);

module.exports = router;
