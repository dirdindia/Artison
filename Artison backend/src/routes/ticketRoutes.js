const express = require('express');
const router = express.Router();
const {
  createTicket,
  getUserTickets,
  getAllTickets,
  getTicketById,
  replyTicket,
  updateTicketStatus,
} = require('../controllers/ticketController');
const { protect, protectAdmin } = require('../middlewares/authMiddleware');

// User routes
router.route('/')
  .post(protect, createTicket)
  .get(protect, protectAdmin, getAllTickets);

router.get('/my-tickets', protect, getUserTickets);

router.route('/:id')
  .get(protect, getTicketById);

router.post('/:id/reply', protect, replyTicket);

// Admin routes
router.put('/:id/status', protect, protectAdmin, updateTicketStatus);

module.exports = router;
