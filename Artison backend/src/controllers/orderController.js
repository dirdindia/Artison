const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const Notification = require('../models/Notification');
const Settings = require('../models/Settings');
const nodemailer = require('nodemailer');
const axios = require('axios');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Use SSL
  family: 4, // Force IPv4
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

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
    
    const mongoose = require('mongoose');
    const productIds = orderItems.map(item => item.product).filter(id => mongoose.Types.ObjectId.isValid(id));
    const productsList = await Product.find({ _id: { $in: productIds } });

    orderItems.forEach(item => {
      if (!mongoose.Types.ObjectId.isValid(item.product)) {
        item.product = new mongoose.Types.ObjectId();
      } else {
        const prod = productsList.find(p => p._id.toString() === item.product.toString());
        if (prod && prod.artist) {
          item.artist = prod.artist;
        }
      }
    });

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
      amount: Math.round(finalAmount * 100), // amount in smallest currency unit (paise)
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    };

    const razorpayOrder = await instance.orders.create(options);

    if (!razorpayOrder) {
      return res.status(500).json({ success: false, message: 'Some error occurred' });
    }

    // Extract unique artists for payouts
    const uniqueArtists = [...new Set(orderItems.filter(item => item.artist).map(item => item.artist.toString()))];
    const artistPayouts = uniqueArtists.map(artist => ({
      artist,
      isUpfrontPaid: false,
      isFinalPaid: false
    }));

    // Immediately create order in our database as Pending
    const orderData = {
      orderItems,
      artistPayouts,
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

    const settings = await Settings.findOne();
    const newOrdersAlert = settings ? settings.newOrdersAlert : true;
    const lowStockAlert = settings ? settings.lowStockAlert : true;

    const Transaction = require('../models/Transaction');

    // Decrement product stock and handle artist earnings
    for (const item of order.orderItems) {
      const product = await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.qty }
      }, { new: true });

      if (item.artist) {
        // Payouts are now handled manually by Admin per order. Wallet balance is no longer auto-credited.
      }

      if (product && product.stock <= 5 && lowStockAlert) {
        await Notification.create({
          recipientType: 'Admin',
          message: `Low stock alert: ${product.name} (Only ${product.stock} left)`,
          type: 'STOCK_LOW',
          relatedId: product._id
        });
      }
    }

    const updatedOrder = await order.save();

    if (newOrdersAlert !== false) {
      await Notification.create({
        recipientType: 'Admin',
        message: `New paid order received! Order ID: #${order._id.toString().substring(18)}`,
        type: 'ORDER_NEW',
        relatedId: order._id
      });
    }

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

        const settings = await Settings.findOne();
        const newOrdersAlert = settings ? settings.newOrdersAlert : true;
        const lowStockAlert = settings ? settings.lowStockAlert : true;

        const Transaction = require('../models/Transaction');

        // Decrement product stock and handle artist earnings
        for (const item of order.orderItems) {
          const product = await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.qty }
          }, { new: true });

          if (item.artist) {
            // Payouts are now handled manually by Admin per order. Wallet balance is no longer auto-credited.
          }

          if (product && product.stock <= 5 && lowStockAlert) {
            await Notification.create({
              recipientType: 'Admin',
              message: `Low stock alert: ${product.name} (Only ${product.stock} left)`,
              type: 'STOCK_LOW',
              relatedId: product._id
            });
          }
        }

        await order.save();

        if (newOrdersAlert !== false) {
          await Notification.create({
            recipientType: 'Admin',
            message: `New paid order received! Order ID: #${order._id.toString().substring(18)}`,
            type: 'ORDER_NEW',
            relatedId: order._id
          });
        }

        console.log(`Webhook: Order ${razorpayOrderId} marked as paid.`);
      }
    } else if (event === 'payment.failed') {
      const paymentEntity = req.body.payload.payment.entity;
      const razorpayOrderId = paymentEntity.order_id;
      const email = paymentEntity.email || req.body.payload.payment.entity.contact;

      if (email) {
        // Send payment failure email
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'Payment Failed - Kalakosh',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #e53e3e; text-align: center;">Payment Failed</h2>
              <p>Hi there,</p>
              <p>We noticed that your recent payment attempt for order <strong>#${razorpayOrderId}</strong> on Kalakosh was unsuccessful.</p>
              <p>Don't worry! Your cart is still saved. You can return to the website and try checking out again.</p>
              <br/>
              <p>If you face any issues, feel free to contact our support team.</p>
              <p>Best regards,<br/>The Kalakosh Team</p>
            </div>
          `
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error('Error sending payment failed email:', error);
          } else {
            console.log('Payment failed email sent:', info.response);
          }
        });
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
      .populate('orderItems.product')
      .populate('artistPayouts.artist', 'name email bankDetails')
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

// @desc    Get orders for logged in artist
// @route   GET /api/orders/artist
// @access  Private/Artist
const getArtistOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await Order.countDocuments({ 'orderItems.artist': req.user.id });
    const orders = await Order.find({ 'orderItems.artist': req.user.id })
      .populate('user', 'name email')
      .populate('orderItems.product')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Filter orderItems to only include this artist's products
    const filteredOrders = orders.map(order => {
      const orderObj = order.toObject();
      orderObj.orderItems = orderObj.orderItems.filter(item => 
        item.artist && item.artist.toString() === req.user.id
      );
      orderObj.artistTotal = orderObj.orderItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
      orderObj.artistEarnings = orderObj.artistTotal * 0.8;
      orderObj.myPayout = orderObj.artistPayouts?.find(p => (p.artist?._id || p.artist).toString() === req.user.id) || null;
      return orderObj;
    });

    res.json({
      success: true,
      data: filteredOrders,
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

const updateArtistOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Verify if this artist has items in this order
    const hasItems = order.orderItems.some(item => 
      item.artist && item.artist.toString() === req.user.id
    );

    if (!hasItems) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this order' });
    }

    order.orderStatus = req.body.status;
    if (req.body.status === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
    
    await order.save();
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const releaseArtistPayout = async (req, res) => {
  try {
    const { id, artistId } = req.params;
    const { type, slipUrl } = req.body; // 'upfront' or 'final'

    const order = await Order.findById(id).populate('orderItems.product');
    if (!order) return res.status(404).json({ success: false, message: 'Order not found' });

    const artistItems = order.orderItems.filter(item => item.artist?.toString() === artistId);
    const productTotal = artistItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
    const shippingTotal = artistItems.reduce((acc, item) => acc + ((item.product?.shippingCharge || 0) * item.qty), 0);

    const payoutIndex = order.artistPayouts.findIndex(p => p.artist.toString() === artistId);
    if (payoutIndex === -1) {
      return res.status(404).json({ success: false, message: 'Artist not found in this order payouts' });
    }

    const payout = order.artistPayouts[payoutIndex];
    const Transaction = require('../models/Transaction');

    if (type === 'upfront') {
      if (payout.isUpfrontPaid) return res.status(400).json({ success: false, message: 'Upfront already paid' });
      payout.isUpfrontPaid = true;
      payout.upfrontPaidAt = Date.now();
      if (slipUrl) payout.upfrontSlipUrl = slipUrl;

      const upfrontAmount = (productTotal * 0.5) + shippingTotal;

      await Transaction.create({
        artist: artistId,
        type: 'Credit',
        amount: upfrontAmount,
        order: order._id,
        description: `Upfront Payout (50% + Shipping) for order #${order._id.toString().substring(18)}`
      });

    } else if (type === 'final') {
      if (order.orderStatus !== 'Delivered') return res.status(400).json({ success: false, message: 'Order not delivered yet' });
      if (payout.isFinalPaid) return res.status(400).json({ success: false, message: 'Final already paid' });
      
      payout.isFinalPaid = true;
      payout.finalPaidAt = Date.now();
      if (slipUrl) payout.finalSlipUrl = slipUrl;

      const finalAmount = productTotal * 0.3;

      await Transaction.create({
        artist: artistId,
        type: 'Credit',
        amount: finalAmount,
        order: order._id,
        description: `Final Payout (30%) for order #${order._id.toString().substring(18)}`
      });
    } else {
      return res.status(400).json({ success: false, message: 'Invalid payout type' });
    }

    await order.save();
    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- NimbusPost Integration ---

const createShipment = async (req, res) => {
  try {
    const { id } = req.params;
    const { weight, length, width, height } = req.body;
    
    const order = await Order.findById(id).populate('user', 'name email phone');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.awbNumber) {
      return res.status(400).json({ success: false, message: 'Shipment already created for this order' });
    }

    const payload = {
      order_number: `ORD-${order._id}-${Date.now()}`,
      shipping_charges: 0,
      discount: order.discountAmount || 0,
      cod_charges: 0,
      payment_type: order.isPaid ? 'prepaid' : 'cod',
      order_amount: order.totalPrice,
      package_weight: weight,
      package_length: length,
      package_width: width,
      package_height: height,
      request_auto_pickup: "yes",
      consignee: {
        name: order.user?.name || order.guestName || 'Customer',
        address: order.shippingAddress.street,
        city: order.shippingAddress.city,
        state: order.shippingAddress.state,
        pincode: order.shippingAddress.postalCode,
        phone: order.user?.phone || order.guestPhone || '9999999999'
      },
      pickup: {
        warehouse_name: process.env.NIMBUSPOST_WAREHOUSE_NAME || 'Primary'
      },
      order_items: order.orderItems.map(item => ({
        name: item.name,
        qty: item.qty,
        price: item.price,
        sku: item.product.toString()
      }))
    };

    const apiKey = process.env.NIMBUSPOST_API_KEY;
    
    let response;
    
    // If a real API key is configured, make the actual request
    if (apiKey && apiKey !== 'dummy-api-key') {
      response = await axios.post('https://api.nimbuspost.com/v1/shipments', payload, {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
    } else {
      // MOCKING the response since we don't have real credentials yet
      console.log('Mocking NimbusPost Request with payload:', payload);
      response = {
        data: {
          status: true,
          data: {
            awb_number: `AWB${Math.floor(Math.random() * 100000000)}`,
            courier_id: 1,
            courier_name: "Delhivery Surface",
            shipment_id: `SHIP${Math.floor(Math.random() * 100000000)}`,
            label: "https://nimbuspost.com/dummy-label.pdf"
          }
        }
      };
    }

    if (response.data && response.data.status) {
      order.awbNumber = response.data.data.awb_number;
      order.courierName = response.data.data.courier_name;
      order.nimbusPostOrderId = response.data.data.shipment_id;
      order.shippingLabelUrl = response.data.data.label;
      order.orderStatus = 'Shipped';
      order.shippingStatus = 'Manifested';
      await order.save();

      // Send Email Notification
      const customerEmail = order.user?.email || order.guestEmail;
      if (customerEmail) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: customerEmail,
          subject: `Your Artisna Order has been Shipped!`,
          html: `
            <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto;">
              <h2>Good news! Your order is on the way.</h2>
              <p>Your order <strong>#${order._id}</strong> has been shipped via <strong>${order.courierName}</strong>.</p>
              <p>Tracking Number (AWB): <strong>${order.awbNumber}</strong></p>
              <a href="https://nimbuspost.com/track/${order.awbNumber}" style="display: inline-block; background: #3b2f2f; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px;">Track Shipment</a>
            </div>
          `
        };
        transporter.sendMail(mailOptions).catch(err => console.log('Tracking Email Error:', err));
      }

      res.json({ success: true, data: order });
    } else {
      res.status(400).json({ success: false, message: 'Failed to create shipment on NimbusPost' });
    }

  } catch (error) {
    console.error('Shipment error:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: error.response?.data?.message || 'Failed to generate shipment' });
  }
};

const trackShipment = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    
    if (!order || !order.awbNumber) {
      return res.status(404).json({ success: false, message: 'Order or AWB not found' });
    }

    const apiKey = process.env.NIMBUSPOST_API_KEY;
    
    let trackingData;
    
    if (apiKey && apiKey !== 'dummy-api-key') {
      const response = await axios.get(`https://api.nimbuspost.com/v1/shipments/track/${order.awbNumber}`, {
        headers: { 'Authorization': `Bearer ${apiKey}` }
      });
      trackingData = response.data.data;
    } else {
      // MOCKING the response
      trackingData = {
        status: order.shippingStatus,
        history: [
          { date: new Date().toISOString(), message: "Shipment manifested", location: "Warehouse" }
        ]
      };
    }

    res.json({ success: true, data: trackingData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch tracking details' });
  }
};

const nimbuspostWebhook = async (req, res) => {
  try {
    // NimbusPost typically sends awb_number and current_status in the payload
    // Example: { "awb_number": "AWB123", "status": "Delivered", ... }
    const payload = req.body;
    const awb = payload.awb || payload.awb_number;
    const status = payload.status || payload.current_status;

    if (!awb || !status) {
      return res.status(400).json({ success: false, message: 'Invalid payload' });
    }

    const order = await Order.findOne({ awbNumber: awb }).populate('user', 'name email');
    if (!order) {
      // If we don't know this AWB, just return 200 so they stop retrying
      return res.status(200).json({ success: true, message: 'AWB not found in our system' });
    }

    // Update tracking status
    order.shippingStatus = status;

    // Check if it's delivered
    // Different couriers might use slightly different strings, but usually it contains 'Delivered'
    const statusLower = status.toLowerCase();
    if (statusLower.includes('delivered') || statusLower === 'dlvd') {
      order.orderStatus = 'Delivered';
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      // Optionally send a delivery confirmation email
      const customerEmail = order.user?.email || order.guestEmail;
      if (customerEmail) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: customerEmail,
          subject: `Your Artisna Order has been Delivered!`,
          html: `
            <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto;">
              <h2>It's here!</h2>
              <p>Your order <strong>#${order._id}</strong> has been successfully delivered.</p>
              <p>We hope you love it! If you have any issues, feel free to contact us.</p>
            </div>
          `
        };
        transporter.sendMail(mailOptions).catch(err => console.log('Delivery Email Error:', err));
      }
    } else if (statusLower.includes('return') || statusLower.includes('rto')) {
      order.orderStatus = 'Returned';
    }

    await order.save();
    res.status(200).json({ success: true, message: 'Webhook processed' });

  } catch (error) {
    console.error('NimbusPost Webhook Error:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
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
  getArtistOrders,
  updateArtistOrderStatus,
  releaseArtistPayout,
  createShipment,
  trackShipment,
  nimbuspostWebhook
};
