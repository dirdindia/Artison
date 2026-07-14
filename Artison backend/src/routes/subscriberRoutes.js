const express = require('express');
const router = express.Router();
const subscriberController = require('../controllers/subscriberController');
const { protectAdmin } = require('../middlewares/authMiddleware');

// Public route to subscribe
router.post('/subscribe', subscriberController.subscribe);

// Admin routes for viewing subscribers and sending newsletters
router.get('/', protectAdmin, subscriberController.getAllSubscribers);
router.post('/send', protectAdmin, subscriberController.sendNewsletter);
router.put('/:id/status', protectAdmin, subscriberController.updateSubscriberStatus);
router.delete('/:id', protectAdmin, subscriberController.deleteSubscriber);

module.exports = router;
