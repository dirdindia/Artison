const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const Notification = require('../models/Notification');

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Order.countDocuments({ user: req.user.id });
    const orders = await Order.find({ user: req.user.id })
      .populate('orderItems.product')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create Razorpay Order and pending DB Order
// @route   POST /api/orders/razorpay
// @access  Private
const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, orderItems, shippingAddress, paymentMethod, couponCode } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    // Coupon validation and discount application
    let discountAmount = 0;
    const Coupon = require('../models/Coupon');
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon && new Date() <= new Date(coupon.expiryDate)) {
        
        // Calculate applicable total
        let applicableTotal = 0;
        if (coupon.applicability === 'all') {
          applicableTotal = amount;
        } else if (coupon.applicability === 'products') {
          const selectedProductIds = coupon.selectedProducts.map(p => p.toString());
          orderItems.forEach(item => {
            const productId = typeof item.product === 'object' ? item.product._id || item.product.id : item.product;
            if (selectedProductIds.includes(productId)) {
              applicableTotal += (item.price * item.qty);
            }
          });
        } else if (coupon.applicability === 'categories') {
          const selectedCategoryIds = coupon.selectedCategories.map(c => c.toString());
          const productIds = orderItems.map(item => typeof item.product === 'object' ? item.product._id || item.product.id : item.product);
          const products = await Product.find({ _id: { $in: productIds } });
          
          orderItems.forEach(item => {
            const productId = typeof item.product === 'object' ? item.product._id || item.product.id : item.product;
            const product = products.find(p => p._id.toString() === productId);
            if (product && product.category && selectedCategoryIds.includes(product.category.toString())) {
              applicableTotal += (item.price * item.qty);
            }
          });
        }

        if (applicableTotal >= coupon.minSpend) {
          if (coupon.discountType === 'percentage') {
            discountAmount = (applicableTotal * coupon.discountValue) / 100;
          } else if (coupon.discountType === 'fixed') {
            discountAmount = coupon.discountValue;
          } else if (coupon.discountType === 'freeship') {
            discountAmount = 499;
          }
          if (discountAmount > applicableTotal) discountAmount = applicableTotal;
        }
      }
    }

    const finalAmount = amount - discountAmount;

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const options = {
      amount: finalAmount * 100, // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const razorpayOrder = await instance.orders.create(options);

    if (!razorpayOrder) {
      return res.status(500).json({ success: false, message: 'Some error occurred' });
    }

    // Immediately create order in our database as Pending
    const orderData = {
      orderItems,
      shippingAddress,
      paymentMethod,
      totalPrice: finalAmount, // Updated total price
      couponCode: couponCode ? couponCode.toUpperCase() : null,
      discountAmount,
      isPaid: false,
      razorpayOrderId: razorpayOrder.id,
    };

    if (req.user && req.user.id) {
      orderData.user = req.user.id;
    } else {
      const { guestEmail, guestName, guestPhone } = req.body;
      
      if (!guestEmail || !guestName) {
        return res.status(401).json({ success: false, message: 'Session expired or user deleted. Please log in again.' });
      }

      let user = await User.findOne({ email: guestEmail });
      
      if (!user) {
        const randomPassword = crypto.randomBytes(8).toString('hex');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(randomPassword, salt);
        
        user = await User.create({
          name: guestName,
          email: guestEmail,
          phone: guestPhone || "0000000000",
          password: hashedPassword,
          address: shippingAddress,
          hasSetPassword: false
        });
      }
      
      orderData.user = user._id;
    }

    const order = new Order(orderData);

    await order.save();

    res.json({ success: true, data: razorpayOrder, key_id: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Verify order payment from frontend
// @route   POST /api/orders/verify
// @access  Private
const verifyOrderPayment = async (req, res) => {
  try {
    const { paymentId, razorpayOrderId, razorpaySignature } = req.body;

    // Verify signature
    const shasum = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    shasum.update(`${razorpayOrderId}|${paymentId}`);
    const digest = shasum.digest("hex");

    if (digest !== razorpaySignature) {
      return res.status(400).json({ success: false, message: 'Transaction not legit!' });
    }

    const order = await Order.findOne({ razorpayOrderId });
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentId = paymentId;

    // Decrement product stock
    for (const item of order.orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.qty }
      });
    }

    const updatedOrder = await order.save();

    await Notification.create({
      recipientType: 'Admin',
      message: `New paid order received! Order ID: #${order._id.toString().substring(18)}`,
      type: 'ORDER_NEW',
      relatedId: order._id
    });

    res.json({ success: true, data: updatedOrder });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Razorpay Webhook for background status update
// @route   POST /api/orders/webhook
// @access  Public
const razorpayWebhook = async (req, res) => {
  try {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
    const signature = req.headers['x-razorpay-signature'];

    if (!signature) {
      return res.status(400).json({ success: false, message: 'No signature found' });
    }

    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");

    if (digest !== signature) {
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    const event = req.body.event;
    if (event === 'payment.captured' || event === 'order.paid') {
      const paymentEntity = req.body.payload.payment.entity;
      const razorpayOrderId = paymentEntity.order_id;
      const paymentId = paymentEntity.id;

      const order = await Order.findOne({ razorpayOrderId });
      if (order && !order.isPaid) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentId = paymentId;

        // Decrement product stock
        for (const item of order.orderItems) {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.qty }
          });
        }

        await order.save();

        await Notification.create({
          recipientType: 'Admin',
          message: `New paid order received! Order ID: #${order._id.toString().substring(18)}`,
          type: 'ORDER_NEW',
          relatedId: order._id
        });

        console.log(`Webhook: Order ${razorpayOrderId} marked as paid.`);
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Webhook error: ", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Order.countDocuments({});
    const orders = await Order.find({})
      .populate('user', 'id name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({ 
      success: true, 
      data: orders,
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

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.orderStatus = status;
      
      // Backward compatibility logic
      if (status === 'Delivered') {
        order.isDelivered = true;
        if (!order.deliveredAt) {
          order.deliveredAt = Date.now();
        }
      }

      const updatedOrder = await order.save();
      res.json({ success: true, data: updatedOrder });
    } else {
      res.status(404).json({ success: false, message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Mark order as viewed by admin
// @route   PUT /api/orders/:id/mark-viewed
// @access  Private/Admin
const markOrderAsViewed = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isViewedByAdmin = true;
      await order.save();
      res.json({ success: true, data: order });
    } else {
      res.status(404).json({ success: false, message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get orders by user ID
// @route   GET /api/orders/user/:userId
// @access  Private/Admin
const getOrdersByUser = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Order.countDocuments({ user: req.params.userId });
    const orders = await Order.find({ user: req.params.userId })
      .populate('orderItems.product')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      data: orders,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getMyOrders,
  createRazorpayOrder,
  verifyOrderPayment,
  razorpayWebhook,
  getAllOrders,
  updateOrderStatus,
  markOrderAsViewed,
  getOrdersByUser,
};
