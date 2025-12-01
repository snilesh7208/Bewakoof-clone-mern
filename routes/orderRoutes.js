const express = require('express');
const router = express.Router();
const {
    checkout,
    getUserOrders,
    getOrderById,
    cancelOrder,
    requestReturn,
    getAdminOrders,
    updateOrderStatus,
    applyCoupon
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/checkout', protect, checkout);
router.post('/apply-coupon', protect, applyCoupon);
router.get('/user', protect, getUserOrders);
router.get('/admin', protect, admin, getAdminOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/cancel', protect, cancelOrder);
router.put('/:id/return', protect, requestReturn);
router.put('/:id/status', protect, admin, updateOrderStatus);

module.exports = router;
