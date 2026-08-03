const express = require('express');
const router = express.Router();
const {
  createContactMessage,
  getContactMessages,
  markContactAsRead,
  deleteContactMessage,
} = require('../controllers/contactController');
const { protectAdmin } = require('../middlewares/authMiddleware');

router.route('/')
  .post(createContactMessage)
  .get(protectAdmin, getContactMessages);

router.route('/:id/read')
  .put(protectAdmin, markContactAsRead);

router.route('/:id')
  .delete(protectAdmin, deleteContactMessage);

module.exports = router;
