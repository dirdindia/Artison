const express = require('express');
const { loginAdmin, signupUser, loginUser } = require('../controllers/authController');

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/login-user', loginUser);
router.post('/signup', signupUser);

module.exports = router;
