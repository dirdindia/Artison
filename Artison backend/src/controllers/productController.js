const Product = require('../models/Product');

// Create a new product
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product, message: 'Product created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get all products with pagination
const getProducts = async (req, res) => {
  try {
    const { skip, limit, page } = req.pagination || { skip: 0, limit: 10, page: 1 };

    const query = {};
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: 'i' } },
        { sku: { $regex: req.query.search, $options: 'i' } }
      ];
    }
    
    if (req.query.lowStock === 'true') {
      query.stock = { $lt: 10 };
    }
    
    if (req.query.category) {
      const categories = req.query.category.split(',');
      query.category = { $in: categories };
    }
    
    if (req.query.subCategory) {
      const subCategories = req.query.subCategory.split(',');
      query.subCategory = { $in: subCategories };
    }

    if (req.query.tags) {
      const tagsArray = req.query.tags.split(',');
      query.tags = { $in: tagsArray };
    }

    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    const products = await Product.find(query)
      .populate('category', 'name')
      .populate('subCategory', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      data: products,
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

// Get a single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name')
      .populate('subCategory', 'name')
      .populate('reviews.user', 'name avatar');
      
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Update a product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, data: product, message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Create new review
const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    // Convert ID string to objectId representation correctly handled by mongoose
    const product = await Product.findById(req.params.id);

    if (product) {
      // Check if user has already reviewed
      const alreadyReviewed = product.reviews.find(
        (r) => r.user.toString() === req.user.id.toString()
      );

      if (alreadyReviewed) {
        return res.status(400).json({ success: false, message: 'Product already reviewed' });
      }

      const review = {
        rating: Number(rating),
        comment,
        user: req.user.id,
      };

      product.reviews.push(review);
      // Do not update rating/numReviews until verified by admin
      
      await product.save();

      await product.save();
      res.status(201).json({ success: true, message: 'Review added' });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get all reviews (Admin)
const getAdminReviews = async (req, res) => {
  try {
    const products = await Product.find({ 'reviews.0': { $exists: true } })
      .select('name reviews')
      .populate('reviews.user', 'name avatar');
    
    let allReviews = [];
    products.forEach(product => {
      product.reviews.forEach(review => {
        allReviews.push({
          ...review.toObject(),
          productId: product._id,
          productName: product.name,
          userName: review.user?.name || 'Unknown User'
        });
      });
    });

    // Sort by newest first
    allReviews.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ success: true, data: allReviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Verify a review
const verifyReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const product = await Product.findById(id);

    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    const review = product.reviews.id(reviewId);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    review.isVerified = true;
    
    // Recalculate rating based only on verified reviews
    const verifiedReviews = product.reviews.filter(r => r.isVerified);
    product.numReviews = verifiedReviews.length;
    product.rating = verifiedReviews.length > 0 
      ? verifiedReviews.reduce((acc, item) => item.rating + acc, 0) / verifiedReviews.length
      : 0;

    await product.save();
    res.status(200).json({ success: true, message: 'Review verified successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Delete a review
const deleteReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    const product = await Product.findById(id);

    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });

    // Pull the review
    product.reviews.pull({ _id: reviewId });

    // Recalculate rating
    const verifiedReviews = product.reviews.filter(r => r.isVerified);
    product.numReviews = verifiedReviews.length;
    product.rating = verifiedReviews.length > 0 
      ? verifiedReviews.reduce((acc, item) => item.rating + acc, 0) / verifiedReviews.length
      : 0;

    await product.save();
    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  createProductReview,
  getAdminReviews,
  verifyReview,
  deleteReview
};
