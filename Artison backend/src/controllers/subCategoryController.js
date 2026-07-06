const SubCategory = require('../models/SubCategory');

// Create a new SubCategory
const createSubCategory = async (req, res) => {
  try {
    const { name, description, image, url, isActive, category } = req.body;

    const existingSubCategory = await SubCategory.findOne({ name });
    if (existingSubCategory) {
      return res.status(400).json({ success: false, message: 'SubCategory with this name already exists' });
    }

    const subCategory = await SubCategory.create({
      name,
      description,
      image,
      url,
      category,
      isActive
    });

    res.status(201).json({ success: true, data: subCategory, message: 'SubCategory created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Get all SubCategories with pagination
const getSubCategories = async (req, res) => {
  try {
    const { skip, limit, page } = req.pagination;

    // Optional: search by name
    const query = {};
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: 'i' };
    }
    
    // Filter by parent category if provided
    if (req.query.category) {
      query.category = req.query.category;
    }

    const SubCategories = await SubCategory.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await SubCategory.countDocuments(query);

    res.status(200).json({
      success: true,
      data: SubCategories,
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

// Update a SubCategory
const updateSubCategory = async (req, res) => {
  try {
    const { name, description, image, url, isActive, category } = req.body;
    
    // Check if name is being updated to an existing one
    if (name) {
      const existing = await SubCategory.findOne({ name, _id: { $ne: req.params.id } });
      if (existing) {
        return res.status(400).json({ success: false, message: 'SubCategory name already in use' });
      }
    }

    const subCategory = await SubCategory.findByIdAndUpdate(
      req.params.id,
      { name, description, image, url, category, isActive },
      { new: true, runValidators: true }
    );

    if (!subCategory) {
      return res.status(404).json({ success: false, message: 'SubCategory not found' });
    }

    res.status(200).json({ success: true, data: subCategory, message: 'SubCategory updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// Delete a SubCategory
const deleteSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.findByIdAndDelete(req.params.id);

    if (!subCategory) {
      return res.status(404).json({ success: false, message: 'SubCategory not found' });
    }

    res.status(200).json({ success: true, message: 'SubCategory deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

module.exports = {
  createSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory
};
