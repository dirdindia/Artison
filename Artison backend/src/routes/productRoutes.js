const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protectAdmin } = require('../middlewares/authMiddleware');
const { paginate } = require('../middlewares/pagination');
const validate = require('../middlewares/validateMiddleware');
const { productSchema } = require('../validations/productValidation');

router.post('/', protectAdmin, validate(productSchema), createProduct);
router.get('/', protectAdmin, paginate, getProducts);
router.put('/:id', protectAdmin, validate(productSchema), updateProduct);
router.delete('/:id', protectAdmin, deleteProduct);

module.exports = router;
