const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

const connectDB = require('./src/config/db');
const { connectCloudinary } = require('./src/config/cloudinary');
const uploadRoutes = require('./src/routes/uploadRoutes');
const authRoutes = require('./src/routes/authRoutes');
const categoryRoutes = require('./src/routes/categoryRoutes');
const subCategoryRoutes = require('./src/routes/subCategoryRoutes');
const productRoutes = require('./src/routes/productRoutes');
const couponRoutes = require('./src/routes/couponRoutes');
const userRoutes = require('./src/routes/userRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const twilioRoutes = require('./src/routes/twilioRoutes');
const ticketRoutes = require('./src/routes/ticketRoutes');
const notificationRoutes = require('./src/routes/notificationRoutes');
const subscriberRoutes = require('./src/routes/subscriberRoutes');

// Connect to database
connectDB().then(() => {
  // Seed default admin if not exists
  const seedAdmin = require('./src/utils/seedAdmin');
  seedAdmin();
  // const seedData = require('./src/utils/seedData');
  // seedData();
});

// Connect to Cloudinary
connectCloudinary();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/upload', uploadRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/subcategories', subCategoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/twilio', twilioRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/subscribers', subscriberRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
