const express = require('express');
const router = express.Router();
const {
    createCoupon,
    getAllCoupons,
    getActiveCoupons,
    getCouponByCode,
    updateCoupon,
    deleteCoupon,
    validateCoupon
} = require('../controllers/couponController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.get('/active', getActiveCoupons);
router.get('/:code', getCouponByCode);

// Protected routes
router.post('/validate', protect, validateCoupon);

// Admin routes
router.post('/', protect, admin, createCoupon);
router.get('/admin/all', protect, admin, getAllCoupons);
router.put('/:id', protect, admin, updateCoupon);
router.delete('/:id', protect, admin, deleteCoupon);

module.exports = router;
