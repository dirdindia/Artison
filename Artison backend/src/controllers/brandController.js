const Brand = require('../models/Brand');

// Create a new brand
const createBrand = async (req, res) => {
  try {
    const { name, description, image, url, isActive } = req.body;

    const existingBrand = await Brand.findOne({ name });
    if (existingBrand) {
      return res.status(400).json({ success: false, message: 'Brand with this name already exists' });
    }

    const brand = await Brand.create({
      name,
      description,
      image,
      url,
      isActive
    });

    res.status(201).json({ success: true, data: brand, message: 'Brand created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get all brands with pagination
const getBrands = async (req, res) => {
  try {
    const { skip, limit, page } = req.pagination;

    // Optional: search by name
    const query = {};
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }

    const brands = await Brand.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Brand.countDocuments(query);

    res.status(200).json({
      success: true,
      data: brands,
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

// Update a brand
const updateBrand = async (req, res) => {
  try {
    const { name, description, image, url, isActive } = req.body;
    
    // Check if name is being updated to an existing one
    if (name) {
      const existing = await Brand.findOne({ name, _id: { $ne: req.params.id } });
      if (existing) {
        return res.status(400).json({ success: false, message: 'Brand name already in use' });
      }
    }

    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      { name, description, image, url, isActive },
      { new: true, runValidators: true }
    );

    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }

    res.status(200).json({ success: true, data: brand, message: 'Brand updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Delete a brand
const deleteBrand = async (req, res) => {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);

    if (!brand) {
      return res.status(404).json({ success: false, message: 'Brand not found' });
    }

    res.status(200).json({ success: true, message: 'Brand deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

module.exports = {
  createBrand,
  getBrands,
  updateBrand,
  deleteBrand
};
