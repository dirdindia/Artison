const mongoose = require('mongoose');
const User = require('./src/models/User');
const Transaction = require('./src/models/Transaction');
require('dotenv').config();

async function check() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/artison');
  const user = await User.findOne({ role: 'artist' });
  console.log('User bank details:', user?.bankDetails);
  
  const payouts = await Transaction.find({ type: 'Debit' }).populate('artist', 'name email bankDetails');
  console.log('Payouts:', JSON.stringify(payouts, null, 2));
  
  mongoose.disconnect();
}

check();
