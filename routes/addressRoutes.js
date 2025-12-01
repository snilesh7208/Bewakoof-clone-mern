const express = require('express');
const router = express.Router();
const {
    getUserAddresses,
    getAddressById,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    checkPincode
} = require('../controllers/addressController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/check-pincode/:pincode', checkPincode);

// Protected routes
router.get('/', protect, getUserAddresses);
router.post('/', protect, addAddress);
router.get('/:id', protect, getAddressById);
router.put('/:id', protect, updateAddress);
router.delete('/:id', protect, deleteAddress);
router.put('/:id/default', protect, setDefaultAddress);

module.exports = router;
