const Transaction = require('../models/Transaction');
const User = require('../models/User');

// @desc    Get artist wallet balance and history
// @route   GET /api/wallet
// @access  Private/Artist
const getWallet = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const transactions = await Transaction.find({ artist: req.user.id })
      .populate('order', 'razorpayOrderId orderStatus')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        walletBalance: user.walletBalance,
        bankDetails: user.bankDetails,
        transactions
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Request a payout
// @route   POST /api/wallet/payout
// @access  Private/Artist
const requestPayout = async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid amount' });
    }

    const user = await User.findById(req.user.id);
    if (user.walletBalance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient balance' });
    }

    // Deduct balance and create pending debit transaction
    user.walletBalance -= amount;
    await user.save();

    const transaction = await Transaction.create({
      artist: req.user.id,
      type: 'Debit',
      amount: amount,
      status: 'Pending',
      description: 'Payout requested'
    });

    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update Bank Details
// @route   PUT /api/wallet/bank
// @access  Private/Artist
const updateBankDetails = async (req, res) => {
  try {
    const { accountHolderName, accountNumber, ifscCode, upiId } = req.body;
    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.bankDetails = {
      accountHolderName: accountHolderName || user.bankDetails.accountHolderName,
      accountNumber: accountNumber || user.bankDetails.accountNumber,
      ifscCode: ifscCode || user.bankDetails.ifscCode,
      upiId: upiId || user.bankDetails.upiId,
    };

    await user.save();
    res.json({ success: true, data: user.bankDetails });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all pending payout requests (Admin)
// @route   GET /api/wallet/payouts
// @access  Private/Admin
const getAllPayouts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await Transaction.countDocuments({ type: 'Debit' });
    const payouts = await Transaction.find({ type: 'Debit' })
      .populate('artist', 'name email bankDetails')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: payouts,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve or Reject Payout (Admin)
// @route   PUT /api/wallet/payouts/:id
// @access  Private/Admin
const updatePayoutStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'Completed' or 'Failed'
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    if (transaction.type !== 'Debit') {
      return res.status(400).json({ success: false, message: 'Not a payout request' });
    }

    transaction.status = status;
    await transaction.save();

    // If failed, refund the wallet
    if (status === 'Failed') {
      await User.findByIdAndUpdate(transaction.artist, {
        $inc: { walletBalance: transaction.amount }
      });
    }

    res.json({ success: true, data: transaction });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getWallet,
  requestPayout,
  updateBankDetails,
  getAllPayouts,
  updatePayoutStatus
};
