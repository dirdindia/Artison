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
const { protectAdmin, protect } = require('../middlewares/authMiddleware');
const { paginate } = require('../middlewares/pagination');
const validate = require('../middlewares/validateMiddleware');
const { productSchema } = require('../validations/productValidation');

router.post('/', protectAdmin, validate(productSchema), createProduct);
router.get('/', paginate, getProducts);
router.get('/admin/reviews', protectAdmin, getAdminReviews);
router.get('/:id', require('../controllers/productController').getProductById);
router.post('/:id/reviews', protect, createProductReview);
router.put('/:id/reviews/:reviewId/verify', protectAdmin, verifyReview);
router.delete('/:id/reviews/:reviewId', protectAdmin, deleteReview);
router.put('/:id', protectAdmin, validate(productSchema), updateProduct);
router.delete('/:id', protectAdmin, deleteProduct);

module.exports = router;
