const Coupon = require('../models/Coupon');

// Create a new coupon
const createCoupon = async (req, res) => {
  try {
    const existingCoupon = await Coupon.findOne({ code: req.body.code });
    if (existingCoupon) {
      return res.status(400).json({ success: false, message: 'Coupon with this code already exists' });
    }

    const coupon = await Coupon.create(req.body);

    res.status(201).json({ success: true, data: coupon, message: 'Coupon created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get all coupons with pagination and optional search
const getCoupons = async (req, res) => {
  try {
    const { skip, limit, page } = req.pagination || { skip: 0, limit: 10, page: 1 };

    const query = {};
    if (req.query.search) {
      query.code = { $regex: req.query.search, $options: 'i' };
    }

    const coupons = await Coupon.find(query)
      .populate('selectedProducts', 'name')
      .populate('selectedCategories', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Coupon.countDocuments(query);

    res.status(200).json({
      success: true,
      data: coupons,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Update a coupon
const updateCoupon = async (req, res) => {
  try {
    const { code } = req.body;
    
    if (code) {
      const existing = await Coupon.findOne({ code, _id: { $ne: req.params.id } });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Coupon code already in use' });
      }
    }

    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    res.status(200).json({ success: true, data: coupon, message: 'Coupon updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Delete a coupon
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Coupon not found' });
    }

    res.status(200).json({ success: true, message: 'Coupon deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

module.exports = {
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon
};
