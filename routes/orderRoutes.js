const express = require('express');
const router = express.Router();
const { checkout, getUserOrders, getAdminOrders } = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/checkout', protect, checkout);
router.get('/user', protect, getUserOrders);
router.get('/admin', protect, admin, getAdminOrders);

module.exports = router;
