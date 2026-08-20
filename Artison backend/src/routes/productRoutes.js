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
  deleteReview,
  createArtistArtwork,
  getArtistArtworks,
  verifyArtwork,
  updateArtistArtwork,
  deleteArtistArtwork
} = require('../controllers/productController');
const { protectAdmin, protect, protectSuperAdmin } = require('../middlewares/authMiddleware');
const { paginate } = require('../middlewares/pagination');
const validate = require('../middlewares/validateMiddleware');
const { productSchema } = require('../validations/productValidation');

router.post('/', protectAdmin, validate(productSchema), createProduct);
router.post('/artist', protect, validate(productSchema), createArtistArtwork);
router.get('/artist', protect, paginate, getArtistArtworks);
router.put('/artist/:id', protect, validate(productSchema), updateArtistArtwork);
router.delete('/artist/:id', protect, deleteArtistArtwork);
router.get('/', paginate, getProducts);
router.get('/admin/reviews', protectAdmin, getAdminReviews);
router.get('/:id', require('../controllers/productController').getProductById);
router.post('/:id/reviews', protect, createProductReview);
router.put('/:id/reviews/:reviewId/verify', protectAdmin, verifyReview);
router.delete('/:id/reviews/:reviewId', protectSuperAdmin, deleteReview);
router.patch('/:id/verify', protectAdmin, verifyArtwork);
router.put('/:id', protectAdmin, validate(productSchema), updateProduct);
router.delete('/:id', protectSuperAdmin, deleteProduct);

module.exports = router;
