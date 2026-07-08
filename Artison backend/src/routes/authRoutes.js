const express = require('express');
const { loginAdmin, signupUser, loginUser, checkEmail, verifyOtp, resetPassword } = require('../controllers/authController');

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/login-user', loginUser);
router.post('/signup', signupUser);
router.post('/check-email', checkEmail);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

module.exports = router;
