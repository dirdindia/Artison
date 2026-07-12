const express = require('express');
const router = express.Router();
const {
  createSubCategory,
  getSubCategories,
  updateSubCategory,
  deleteSubCategory
} = require('../controllers/subCategoryController');
const { protectAdmin } = require('../middlewares/authMiddleware');
const { paginate } = require('../middlewares/pagination');
const validate = require('../middlewares/validateMiddleware');
const { SubCategorySchema } = require('../validations/subCategoryValidation');

router.post('/', protectAdmin, validate(SubCategorySchema), createSubCategory);
router.get('/', paginate, getSubCategories);
router.put('/:id', protectAdmin, validate(SubCategorySchema), updateSubCategory);
router.delete('/:id', protectAdmin, deleteSubCategory);

module.exports = router;
