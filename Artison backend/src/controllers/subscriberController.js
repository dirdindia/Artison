const Subscriber = require('../models/Subscriber');
const nodemailer = require('nodemailer');
const Joi = require('joi');

// Joi schemas
const subscribeSchema = Joi.object({
  email: Joi.string().email().required()
});

const newsletterSchema = Joi.object({
  subject: Joi.string().required(),
  body: Joi.string().required(),
  target: Joi.string().valid('all', 'specific').default('all'),
  specificEmails: Joi.array().items(Joi.string().email()).optional(),
  imageUrl: Joi.string().uri().allow('').optional()
});

// Configure Nodemailer transporter
// Note: Requires process.env.EMAIL_USER and process.env.EMAIL_PASS
const transporter = nodemailer.createTransport({
  service: 'gmail', // or use host and port for other SMTP
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.subscribe = async (req, res) => {
  try {
    const { error } = subscribeSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { email } = req.body;
    
    // Check if already subscribed
    let subscriber = await Subscriber.findOne({ email });
    if (subscriber) {
      if (subscriber.status === 'unsubscribed') {
        subscriber.status = 'active';
        await subscriber.save();
        return res.status(200).json({ message: 'Successfully resubscribed!' });
      }
      return res.status(400).json({ message: 'Email is already subscribed.' });
    }

    subscriber = new Subscriber({ email });
    await subscriber.save();

    res.status(201).json({ message: 'Successfully subscribed to newsletter!' });
  } catch (error) {
    console.error('Subscribe Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllSubscribers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const subscribers = await Subscriber.find({})
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Subscriber.countDocuments({});

    res.status(200).json({
      subscribers,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get Subscribers Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.sendNewsletter = async (req, res) => {
  try {
    const { error } = newsletterSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    const { subject, body, target, specificEmails, imageUrl } = req.body;

    let activeSubscribers = [];
    if (target === 'specific' && specificEmails && specificEmails.length > 0) {
      activeSubscribers = await Subscriber.find({ email: { $in: specificEmails }, status: 'active' });
    } else {
      activeSubscribers = await Subscriber.find({ status: 'active' });
    }
    
    if (activeSubscribers.length === 0) {
      return res.status(400).json({ message: 'No active subscribers found.' });
    }

    const emails = activeSubscribers.map(sub => sub.email);

    let finalHtml = body;
    if (imageUrl) {
      finalHtml += `<br><br><img src="${imageUrl}" alt="Newsletter Image" style="max-width: 100%; border-radius: 8px;" />`;
    }

    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address
      bcc: emails, // Use BCC so subscribers don't see each other's emails
      subject: subject,
      html: finalHtml
    };

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('Sending mock email because credentials are not set in .env:', mailOptions);
        return res.status(200).json({ message: `Simulated sending newsletter to ${emails.length} subscribers.` });
    }

    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ message: `Newsletter sent successfully to ${emails.length} subscribers.` });
  } catch (error) {
    console.error('Send Newsletter Error:', error);
    res.status(500).json({ message: 'Internal server error while sending newsletter' });
  }
};

exports.updateSubscriberStatus = async (req, res) => {
  try {
    const subscriber = await Subscriber.findById(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }
    subscriber.status = subscriber.status === 'active' ? 'unsubscribed' : 'active';
    await subscriber.save();
    res.json({ message: `Subscriber marked as ${subscriber.status}`, subscriber });
  } catch (error) {
    console.error('Update Status Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.deleteSubscriber = async (req, res) => {
  try {
    const subscriber = await Subscriber.findByIdAndDelete(req.params.id);
    if (!subscriber) {
      return res.status(404).json({ message: 'Subscriber not found' });
    }
    res.json({ message: 'Subscriber deleted successfully' });
  } catch (error) {
    console.error('Delete Subscriber Error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
