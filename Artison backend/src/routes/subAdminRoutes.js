const express = require('express');
const router = express.Router();
const { getSubAdmins, createSubAdmin, updateSubAdmin, deleteSubAdmin } = require('../controllers/subAdminController');
const { protectSuperAdmin } = require('../middlewares/authMiddleware');

router.route('/')
  .get(protectSuperAdmin, getSubAdmins)
  .post(protectSuperAdmin, createSubAdmin);

router.route('/:id')
  .put(protectSuperAdmin, updateSubAdmin)
  .delete(protectSuperAdmin, deleteSubAdmin);

module.exports = router;
