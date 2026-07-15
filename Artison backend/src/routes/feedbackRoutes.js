const express = require('express');
const router = express.Router();
const {
  submitFeedback,
  getApprovedFeedbacks,
  getAllFeedbacks,
  approveFeedback,
  deleteFeedback
} = require('../controllers/feedbackController');
const { protectAdmin } = require('../middlewares/authMiddleware');

// Public routes
router.post('/', submitFeedback);
router.get('/approved', getApprovedFeedbacks);

// Admin routes
router.get('/', protectAdmin, getAllFeedbacks);
router.put('/:id/approve', protectAdmin, approveFeedback);
router.delete('/:id', protectAdmin, deleteFeedback);

module.exports = router;
