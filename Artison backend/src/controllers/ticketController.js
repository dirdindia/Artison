const Ticket = require('../models/Ticket');
const User = require('../models/User');
const Notification = require('../models/Notification');

// @desc    Create a new ticket
// @route   POST /api/tickets
// @access  Private
const createTicket = async (req, res) => {
  try {
    const { subject, description, image } = req.body;

    const ticket = new Ticket({
      user: req.user.id,
      subject,
      description,
      image: image || '',
    });

    const createdTicket = await ticket.save();

    // Create Notification for Admin
    await Notification.create({
      recipientType: 'Admin',
      message: `New ticket received: ${subject}`,
      type: 'TICKET_NEW',
      relatedId: createdTicket._id
    });

    res.status(201).json(createdTicket);
  } catch (error) {
    res.status(500).json({ message: 'Error creating ticket', error: error.message });
  }
};

// @desc    Get user tickets
// @route   GET /api/tickets/my-tickets
// @access  Private
const getUserTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tickets', error: error.message });
  }
};

// @desc    Get all tickets (Admin)
// @route   GET /api/tickets
// @access  Private/Admin
const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({})
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tickets', error: error.message });
  }
};

// @desc    Get ticket by ID
// @route   GET /api/tickets/:id
// @access  Private
const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate('user', 'name email avatar');

    if (ticket) {
      // Check if user is owner or admin
      if (ticket.user._id.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to view this ticket' });
      }
      res.json(ticket);
    } else {
      res.status(404).json({ message: 'Ticket not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching ticket', error: error.message });
  }
};

// @desc    Reply to a ticket
// @route   POST /api/tickets/:id/reply
// @access  Private
const replyTicket = async (req, res) => {
  try {
    const { message, image } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (ticket) {
      // Allow only ticket owner or admin
      if (ticket.user.toString() !== req.user.id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to reply to this ticket' });
      }

      if (ticket.status === 'closed') {
        return res.status(400).json({ message: 'Cannot reply to a closed ticket' });
      }

      const reply = {
        senderModel: req.user.role === 'admin' ? 'Admin' : 'User',
        senderId: req.user.id,
        message,
        image: image || '',
      };

      ticket.chat.push(reply);
      await ticket.save();

      // Create Notification
      const isAdmin = req.user.role === 'admin';
      await Notification.create({
        recipient: isAdmin ? ticket.user : null,
        recipientType: isAdmin ? 'User' : 'Admin',
        message: isAdmin ? `Admin replied to your ticket #${ticket._id.toString().substring(18)}` : `User replied to ticket #${ticket._id.toString().substring(18)}`,
        type: 'TICKET_REPLY',
        relatedId: ticket._id
      });

      res.status(201).json(ticket);
    } else {
      res.status(404).json({ message: 'Ticket not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error replying to ticket', error: error.message });
  }
};

// @desc    Update ticket status
// @route   PUT /api/tickets/:id/status
// @access  Private/Admin
const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (ticket) {
      ticket.status = status;
      const updatedTicket = await ticket.save();
      res.json(updatedTicket);
    } else {
      res.status(404).json({ message: 'Ticket not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating ticket status', error: error.message });
  }
};

module.exports = {
  createTicket,
  getUserTickets,
  getAllTickets,
  getTicketById,
  replyTicket,
  updateTicketStatus,
};
