const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markAsRead,
  markAllAsRead
} = require('../controllers/notificationController');
const { optionalProtect } = require('../middlewares/authMiddleware'); // Wait, we can use a custom middleware or just protect/protectAdmin. We will use optionalProtect and let the controller handle it based on req.user or req.admin.

// For notifications, we want a single endpoint that handles both user and admin.
// We can use a combination, or just `optionalProtect` which decodes token and sets `req.user`.
// Note: `protectAdmin` sets `req.admin`, but our optionalProtect sets `req.user`.

router.use(optionalProtect);

router.route('/')
  .get(getNotifications);

router.put('/read-all', markAllAsRead);

router.route('/:id/read')
  .put(markAsRead);

module.exports = router;
