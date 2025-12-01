const Address = require('../models/Address');

// @desc    Get user addresses
// @route   GET /api/addresses
// @access  Private
const getUserAddresses = async (req, res) => {
    try {
        const addresses = await Address.find({ user: req.user._id }).sort({ isDefault: -1, createdAt: -1 });
        res.json(addresses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get address by ID
// @route   GET /api/addresses/:id
// @access  Private
const getAddressById = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);

        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // Check if user owns this address
        if (address.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        res.json(address);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add new address
// @route   POST /api/addresses
// @access  Private
const addAddress = async (req, res) => {
    try {
        const {
            name,
            phone,
            addressLine1,
            addressLine2,
            landmark,
            city,
            state,
            pincode,
            addressType,
            isDefault
        } = req.body;

        const address = new Address({
            user: req.user._id,
            name,
            phone,
            addressLine1,
            addressLine2,
            landmark,
            city,
            state,
            pincode,
            addressType,
            isDefault: isDefault || false
        });

        const createdAddress = await address.save();
        res.status(201).json(createdAddress);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update address
// @route   PUT /api/addresses/:id
// @access  Private
const updateAddress = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);

        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // Check if user owns this address
        if (address.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        Object.keys(req.body).forEach(key => {
            address[key] = req.body[key];
        });

        const updatedAddress = await address.save();
        res.json(updatedAddress);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete address
// @route   DELETE /api/addresses/:id
// @access  Private
const deleteAddress = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);

        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // Check if user owns this address
        if (address.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await address.deleteOne();
        res.json({ message: 'Address removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Set default address
// @route   PUT /api/addresses/:id/default
// @access  Private
const setDefaultAddress = async (req, res) => {
    try {
        const address = await Address.findById(req.params.id);

        if (!address) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // Check if user owns this address
        if (address.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Remove default from all other addresses
        await Address.updateMany(
            { user: req.user._id },
            { isDefault: false }
        );

        address.isDefault = true;
        await address.save();

        res.json({ message: 'Default address updated', address });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Check pincode serviceability
// @route   GET /api/addresses/check-pincode/:pincode
// @access  Public
const checkPincode = async (req, res) => {
    try {
        const { pincode } = req.params;

        // Validate pincode format
        if (!/^[0-9]{6}$/.test(pincode)) {
            return res.status(400).json({ message: 'Invalid pincode format' });
        }

        // In a real application, you would integrate with a pincode API
        // For now, we'll simulate the response
        const serviceable = true; // Assume all pincodes are serviceable
        const estimatedDays = 5 + Math.floor(Math.random() * 3); // 5-7 days

        res.json({
            serviceable,
            pincode,
            estimatedDeliveryDays: estimatedDays,
            message: serviceable
                ? `Delivery available in ${estimatedDays} days`
                : 'Delivery not available for this pincode'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getUserAddresses,
    getAddressById,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    checkPincode
};
