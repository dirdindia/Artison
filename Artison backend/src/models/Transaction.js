const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    artist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: {
      type: String,
      enum: ['Credit', 'Debit'],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'],
      default: 'Completed',
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
