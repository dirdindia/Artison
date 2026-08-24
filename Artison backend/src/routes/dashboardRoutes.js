const express = require('express');
const { protect, protectAdmin } = require('../middlewares/authMiddleware');
const { getArtistDashboard, getAdminDashboard } = require('../controllers/dashboardController');

const router = express.Router();

router.get('/artist', protect, getArtistDashboard);
router.get('/admin', protect, protectAdmin, getAdminDashboard);

module.exports = router;
