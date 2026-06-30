const express = require('express');
const router = express.Router();
const {
  createBrand,
  getBrands,
  updateBrand,
  deleteBrand
} = require('../controllers/brandController');
const { protectAdmin } = require('../middlewares/authMiddleware');
const { paginate } = require('../middlewares/pagination');
const validate = require('../middlewares/validateMiddleware');
const { brandSchema } = require('../validations/brandValidation');

router.post('/', protectAdmin, validate(brandSchema), createBrand);
router.get('/', protectAdmin, paginate, getBrands);
router.put('/:id', protectAdmin, validate(brandSchema), updateBrand);
router.delete('/:id', protectAdmin, deleteBrand);

module.exports = router;
