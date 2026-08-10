const express = require('express');
const router = express.Router();
const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController');
const { protectAdmin, protectSuperAdmin } = require('../middlewares/authMiddleware');
const { paginate } = require('../middlewares/pagination');
const validate = require('../middlewares/validateMiddleware');
const { categorySchema } = require('../validations/categoryValidation');

router.post('/', protectAdmin, validate(categorySchema), createCategory);
router.get('/', paginate, getCategories);
router.put('/:id', protectAdmin, validate(categorySchema), updateCategory);
router.delete('/:id', protectSuperAdmin, deleteCategory);

module.exports = router;
