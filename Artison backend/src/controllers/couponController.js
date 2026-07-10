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

// Validate coupon and calculate discount
const validateCoupon = async (req, res) => {
  try {
    const { code, cartTotal, cartItems } = req.body;
    
    if (!code || !cartTotal || !cartItems || !Array.isArray(cartItems)) {
      return res.status(400).json({ success: false, message: 'Coupon code, cart total, and cart items are required' });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });
    
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or inactive coupon' });
    }

    if (new Date() > new Date(coupon.expiryDate)) {
      return res.status(400).json({ success: false, message: 'Coupon has expired' });
    }

    // Calculate applicable total based on coupon applicability
    let applicableTotal = 0;

    if (coupon.applicability === 'all') {
      applicableTotal = cartTotal;
    } else if (coupon.applicability === 'products') {
      const selectedProductIds = coupon.selectedProducts.map(p => p.toString());
      cartItems.forEach(item => {
        // item.product can be string ID or object depending on payload
        const productId = typeof item.product === 'object' ? item.product._id || item.product.id : item.product;
        if (selectedProductIds.includes(productId)) {
          applicableTotal += (item.price * item.qty);
        }
      });
    } else if (coupon.applicability === 'categories') {
      const selectedCategoryIds = coupon.selectedCategories.map(c => c.toString());
      cartItems.forEach(item => {
        // assuming item has category info or product info contains category
        // we'll need to fetch the products to get their categories if not provided in cartItems
        // but for now, let's assume the frontend provides category ID in the item if needed, 
        // or we fetch them here to be safe.
      });
      // To be safe and since frontend might not have category ID easily available in checkout payload,
      // let's fetch the products in the cart to check categories.
      const productIds = cartItems.map(item => typeof item.product === 'object' ? item.product._id || item.product.id : item.product);
      const Product = require('../models/Product');
      const products = await Product.find({ _id: { $in: productIds } });
      
      cartItems.forEach(item => {
        const productId = typeof item.product === 'object' ? item.product._id || item.product.id : item.product;
        const product = products.find(p => p._id.toString() === productId);
        if (product && product.category && selectedCategoryIds.includes(product.category.toString())) {
          applicableTotal += (item.price * item.qty);
        }
      });
    }

    if (applicableTotal === 0) {
      return res.status(400).json({ success: false, message: 'Coupon is not applicable to any items in your cart' });
    }

    if (applicableTotal < coupon.minSpend) {
      return res.status(400).json({ success: false, message: `Minimum spend of ₹${coupon.minSpend} on eligible items required` });
    }

    let discountAmount = 0;
    
    if (coupon.discountType === 'percentage') {
      discountAmount = (applicableTotal * coupon.discountValue) / 100;
    } else if (coupon.discountType === 'fixed') {
      discountAmount = coupon.discountValue;
    } else if (coupon.discountType === 'freeship') {
      discountAmount = 499; // Assuming fixed shipping cost is 499
    }

    // Ensure discount doesn't exceed applicable total
    if (discountAmount > applicableTotal) {
      discountAmount = applicableTotal;
    }

    res.status(200).json({
      success: true,
      data: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: discountAmount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

module.exports = {
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon,
  validateCoupon
};
