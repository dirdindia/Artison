const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Ticket = require('../models/Ticket');

// @desc    Get artist dashboard stats
// @route   GET /api/dashboard/artist
// @access  Private/Artist
const getArtistDashboard = async (req, res) => {
  try {
    const artistId = req.user.id;
    const user = await User.findById(artistId);

    if (!user || user.role !== 'artist') {
      return res.status(403).json({ success: false, message: 'Not authorized as an artist' });
    }

    // 1. Total Revenue (sum of all completed Credit transactions)
    const revenueAggregation = await Transaction.aggregate([
      { $match: { artist: user._id, type: 'Credit', status: 'Completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].total : 0;

    // 2. Active Artworks
    const activeArtworks = await Product.countDocuments({
      artist: artistId,
      isActive: true,
      approvalStatus: 'approved'
    });

    // 3. Pending Orders (Orders with Processing status containing artist's products)
    const pendingOrdersCount = await Order.countDocuments({
      'orderItems.artist': artistId,
      orderStatus: 'Processing'
    });

    // 4. Recent Orders (Last 5 orders)
    const recentOrders = await Order.find({
      'orderItems.artist': artistId
    })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email');

    // 5. Top Artworks (Last 3 created or highest rated)
    const topArtworks = await Product.find({
      artist: artistId
    })
      .sort({ rating: -1, createdAt: -1 })
      .limit(3);

    res.json({
      success: true,
      data: {
        totalRevenue,
        activeArtworks,
        pendingOrders: pendingOrdersCount,
        profileViews: 0, // Placeholder as we don't track this yet
        recentOrders,
        topArtworks
      }
    });

  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/dashboard/admin
// @access  Private/Admin
const getAdminDashboard = async (req, res) => {
  try {
    // 1. Total Revenue (Sum of all paid orders)
    const revenueAggregation = await Order.aggregate([
      { $match: { isPaid: true } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].total : 0;

    // 2. Active Artworks
    const activeArtworks = await Product.countDocuments({ isActive: true });

    // 3. New Customers
    const newCustomers = await User.countDocuments({ role: 'customer' });

    // 4. Total Orders (Sales Growth proxy)
    const totalOrders = await Order.countDocuments();

    // 5. Recent Orders
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name');

    // 6. Recent Customers
    const recentCustomers = await User.find({ role: 'customer' })
      .sort({ createdAt: -1 })
      .limit(5);

    // 7. Recent Tickets
    const recentTickets = await Ticket.find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name');

    // 8. Revenue Data for Chart (Last 7 months)
    const sevenMonthsAgo = new Date();
    sevenMonthsAgo.setMonth(sevenMonthsAgo.getMonth() - 7);
    
    const monthlyRevenue = await Order.aggregate([
      { 
        $match: { 
          isPaid: true, 
          createdAt: { $gte: sevenMonthsAgo } 
        } 
      },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          revenue: { $sum: "$totalPrice" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Format for frontend: { name: 'Jan', revenue: 40000 }
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const revenueData = monthlyRevenue.map(item => ({
      name: monthNames[item._id.month - 1],
      revenue: item.revenue
    }));

    res.json({
      success: true,
      data: {
        totalRevenue,
        activeArtworks,
        newCustomers,
        totalOrders,
        revenueData,
        recentOrders,
        recentCustomers,
        recentTickets
      }
    });

  } catch (error) {
    console.error('Admin Dashboard Error:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getArtistDashboard,
  getAdminDashboard
};
