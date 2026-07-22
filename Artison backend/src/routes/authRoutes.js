const express = require('express');
const { loginAdmin, signupUser, loginUser, checkEmail, verifyOtp, resetPassword, updatePassword } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/login-user', loginUser);
router.post('/signup', signupUser);
router.post('/check-email', checkEmail);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.put('/update-password', protect, updatePassword);

module.exports = router;
