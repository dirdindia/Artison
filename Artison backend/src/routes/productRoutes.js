const express = require('express');
const router = express.Router();
const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  createProductReview,
  getAdminReviews,
  verifyReview,
  deleteReview
} = require('../controllers/productController');
const { protectAdmin, protect, protectSuperAdmin } = require('../middlewares/authMiddleware');
const { paginate } = require('../middlewares/pagination');
const validate = require('../middlewares/validateMiddleware');
const { productSchema } = require('../validations/productValidation');

router.post('/', protectAdmin, validate(productSchema), createProduct);
router.get('/', paginate, getProducts);
router.get('/admin/reviews', protectAdmin, getAdminReviews);
router.get('/:id', require('../controllers/productController').getProductById);
router.post('/:id/reviews', protect, createProductReview);
router.put('/:id/reviews/:reviewId/verify', protectAdmin, verifyReview);
router.delete('/:id/reviews/:reviewId', protectSuperAdmin, deleteReview);
router.put('/:id', protectAdmin, validate(productSchema), updateProduct);
router.delete('/:id', protectSuperAdmin, deleteProduct);

module.exports = router;
