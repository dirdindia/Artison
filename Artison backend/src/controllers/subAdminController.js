const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @desc    Get all subadmins
// @route   GET /api/subadmins
// @access  Private/SuperAdmin
exports.getSubAdmins = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { role: 'subadmin' };

    const subAdmins = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort('-createdAt');

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: subAdmins,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Create a subadmin
// @route   POST /api/subadmins
// @access  Private/SuperAdmin
exports.createSubAdmin = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const subAdmin = await User.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: 'subadmin',
    });

    res.status(201).json({
      success: true,
      data: {
        _id: subAdmin._id,
        name: subAdmin.name,
        email: subAdmin.email,
        role: subAdmin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Update a subadmin
// @route   PUT /api/subadmins/:id
// @access  Private/SuperAdmin
exports.updateSubAdmin = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    let subAdmin = await User.findById(req.params.id);
    if (!subAdmin || subAdmin.role !== 'subadmin') {
      return res.status(404).json({ success: false, message: 'Subadmin not found' });
    }

    if (email && email !== subAdmin.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ success: false, message: 'Email is already in use by another account' });
      }
    }

    subAdmin.name = name || subAdmin.name;
    subAdmin.email = email || subAdmin.email;
    subAdmin.phone = phone || subAdmin.phone;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      subAdmin.password = await bcrypt.hash(password, salt);
    }

    await subAdmin.save();

    res.json({
      success: true,
      data: {
        _id: subAdmin._id,
        name: subAdmin.name,
        email: subAdmin.email,
        phone: subAdmin.phone,
        role: subAdmin.role,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};

// @desc    Delete a subadmin
// @route   DELETE /api/subadmins/:id
// @access  Private/SuperAdmin
exports.deleteSubAdmin = async (req, res) => {
  try {
    const subAdmin = await User.findById(req.params.id);
    
    if (!subAdmin || subAdmin.role !== 'subadmin') {
      return res.status(404).json({ success: false, message: 'Subadmin not found' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Subadmin removed successfully',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
};
