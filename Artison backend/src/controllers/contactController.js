const Contact = require('../models/Contact');
const Notification = require('../models/Notification');

// @desc    Submit a contact message
// @route   POST /api/contacts
// @access  Public
const createContactMessage = async (req, res) => {
  try {
    const { name, email, mobile, message } = req.body;

    if (!name || !email || !mobile || !message) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const contact = await Contact.create({
      name,
      email,
      mobile,
      message,
    });

    // Create a notification for the admin
    await Notification.create({
      recipientType: 'Admin',
      message: `New contact message from ${name}`,
      type: 'CONTACT_NEW',
      relatedId: contact._id,
    });

    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: 'Error submitting contact message', error: error.message });
  }
};

// @desc    Get all contact messages
// @route   GET /api/contacts
// @access  Private/Admin
const getContactMessages = async (req, res) => {
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching contact messages', error: error.message });
  }
};

// @desc    Mark contact message as read
// @route   PUT /api/contacts/:id/read
// @access  Private/Admin
const markContactAsRead = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (contact) {
      contact.isRead = true;
      const updatedContact = await contact.save();
      res.json(updatedContact);
    } else {
      res.status(404).json({ message: 'Contact message not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error marking contact message as read', error: error.message });
  }
};

// @desc    Delete a contact message
// @route   DELETE /api/contacts/:id
// @access  Private/Admin
const deleteContactMessage = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (contact) {
      await contact.deleteOne();
      res.json({ message: 'Contact message removed' });
    } else {
      res.status(404).json({ message: 'Contact message not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error deleting contact message', error: error.message });
  }
};

module.exports = {
  createContactMessage,
  getContactMessages,
  markContactAsRead,
  deleteContactMessage,
};
