const mongoose = require('mongoose');
const Transaction = require('./Artison backend/src/models/Transaction');
const User = require('./Artison backend/src/models/User');
require('dotenv').config({ path: './Artison backend/.env' });

async function check() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/artison');
  const payouts = await Transaction.find({ type: 'Debit' }).populate('artist', 'name email bankDetails');
  console.log(JSON.stringify(payouts, null, 2));
  mongoose.disconnect();
}

check();
