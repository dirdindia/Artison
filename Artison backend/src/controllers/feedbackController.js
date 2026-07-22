const Feedback = require('../models/Feedback');
const Notification = require('../models/Notification');
const Settings = require('../models/Settings');

// Public: Submit a new feedback
exports.submitFeedback = async (req, res) => {
  try {
    const { name, rating, comment } = req.body;
    
    if (!name || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide name, rating, and comment' });
    }

    const feedback = await Feedback.create({
      name,
      rating: Number(rating),
      comment
    });

    const settings = await Settings.findOne();
    if (!settings || settings.newReviewAlert !== false) { // Default to true if not strictly false
      await Notification.create({
        recipientType: 'Admin',
        message: `New feedback received from ${name}`,
        type: 'FEEDBACK_NEW',
        relatedId: feedback._id
      });
    }

    res.status(201).json({ success: true, message: 'Feedback submitted successfully', data: feedback });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Public: Get all approved feedbacks for the home page
exports.getApprovedFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find({ isApproved: true }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Admin: Get all feedbacks (approved and unapproved)
exports.getAllFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: feedbacks });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Admin: Approve or unapprove feedback
exports.approveFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }

    feedback.isApproved = !feedback.isApproved;
    await feedback.save();

    res.status(200).json({ 
      success: true, 
      message: `Feedback ${feedback.isApproved ? 'approved' : 'unapproved'} successfully`,
      data: feedback
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};

// Admin: Delete feedback
exports.deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id);
    
    if (!feedback) {
      return res.status(404).json({ success: false, message: 'Feedback not found' });
    }

    res.status(200).json({ success: true, message: 'Feedback deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error: error.message });
  }
};
