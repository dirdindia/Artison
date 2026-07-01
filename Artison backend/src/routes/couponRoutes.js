const express = require('express');
const router = express.Router();
const { protectAdmin } = require('../middlewares/authMiddleware');
const { paginate } = require('../middlewares/pagination');
const validate = require('../middlewares/validateMiddleware');
const { couponSchema } = require('../validations/couponValidation');
const {
  createCoupon,
  getCoupons,
  updateCoupon,
  deleteCoupon
} = require('../controllers/couponController');

router.post('/', protectAdmin, validate(couponSchema), createCoupon);
router.get('/', protectAdmin, paginate, getCoupons);
router.put('/:id', protectAdmin, validate(couponSchema), updateCoupon);
router.delete('/:id', protectAdmin, deleteCoupon);

module.exports = router;
