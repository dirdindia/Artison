const Notification = require('../models/Notification');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    let query = {};
    if (req.user && req.user.role === 'admin') {
      // If admin route was called via protectAdmin, the user object might be under req.admin or req.user depending on authMiddleware. 
      // Based on our authMiddleware, protectAdmin sets req.admin = decoded.
      // Wait, let's use the role.
    }
    
    // Check if it's admin or user
    if (req.admin || (req.user && req.user.role === 'admin')) {
       query = { recipientType: 'Admin' };
    } else {
       query = { recipientType: 'User', recipient: req.user.id };
    }

    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(20);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications', error: error.message });
  }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (notification) {
      // Verify ownership
      if (notification.recipientType === 'User' && notification.recipient.toString() !== req.user.id.toString()) {
        return res.status(403).json({ message: 'Not authorized' });
      }

      notification.read = true;
      await notification.save();
      res.json(notification);
    } else {
      res.status(404).json({ message: 'Notification not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification', error: error.message });
  }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
  try {
    let query = {};
    if (req.admin || (req.user && req.user.role === 'admin')) {
       query = { recipientType: 'Admin', read: false };
    } else {
       query = { recipientType: 'User', recipient: req.user.id, read: false };
    }

    await Notification.updateMany(query, { read: true });
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notifications', error: error.message });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead
};
