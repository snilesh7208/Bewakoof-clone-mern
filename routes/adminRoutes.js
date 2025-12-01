const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getAllUsers,
    toggleBlockUser,
    updateUserRole,
    deleteUser
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes are admin-protected
router.get('/stats', protect, admin, getDashboardStats);
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id/block', protect, admin, toggleBlockUser);
router.put('/users/:id/role', protect, admin, updateUserRole);
router.delete('/users/:id', protect, admin, deleteUser);

module.exports = router;
