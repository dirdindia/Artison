const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
    chat: [
      {
        senderModel: {
          type: String,
          required: true,
          enum: ['User', 'Admin'], // Using User as generic reference for Admin for now, or just literal string
        },
        senderId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        message: {
          type: String,
        },
        image: {
          type: String,
          default: '',
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Ticket', ticketSchema);
