const Coupon = require('../models/Coupon');

// @desc    Create coupon (Admin)
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = async (req, res) => {
    try {
        const {
            code,
            description,
            discountType,
            discountValue,
            minOrderValue,
            maxDiscount,
            usageLimit,
            validFrom,
            validUntil,
            applicableCategories,
            applicableProducts,
            newUsersOnly
        } = req.body;

        // Check if coupon code already exists
        const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
        if (existingCoupon) {
            return res.status(400).json({ message: 'Coupon code already exists' });
        }

        const coupon = new Coupon({
            code: code.toUpperCase(),
            description,
            discountType,
            discountValue,
            minOrderValue,
            maxDiscount,
            usageLimit,
            validFrom,
            validUntil,
            applicableCategories,
            applicableProducts,
            userRestrictions: {
                newUsersOnly: newUsersOnly || false
            },
            createdBy: req.user._id
        });

        const createdCoupon = await coupon.save();
        res.status(201).json(createdCoupon);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all coupons (Admin)
// @route   GET /api/coupons/admin
// @access  Private/Admin
const getAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({}).sort({ createdAt: -1 });
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get active coupons (Public)
// @route   GET /api/coupons/active
// @access  Public
const getActiveCoupons = async (req, res) => {
    try {
        const now = new Date();
        const coupons = await Coupon.find({
            isActive: true,
            validFrom: { $lte: now },
            validUntil: { $gte: now }
        }).select('-createdBy -usedCount');
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get coupon by code
// @route   GET /api/coupons/:code
// @access  Public
const getCouponByCode = async (req, res) => {
    try {
        const coupon = await Coupon.findOne({ code: req.params.code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }

        if (!coupon.isValid()) {
            return res.status(400).json({ message: 'Coupon is not valid or has expired' });
        }

        res.json(coupon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update coupon (Admin)
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }

        Object.keys(req.body).forEach(key => {
            if (key === 'code') {
                coupon[key] = req.body[key].toUpperCase();
            } else {
                coupon[key] = req.body[key];
            }
        });

        const updatedCoupon = await coupon.save();
        res.json(updatedCoupon);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete/Deactivate coupon (Admin)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }

        // Deactivate instead of delete to maintain history
        coupon.isActive = false;
        await coupon.save();

        res.json({ message: 'Coupon deactivated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Validate coupon
// @route   POST /api/coupons/validate
// @access  Private
const validateCoupon = async (req, res) => {
    try {
        const { code, orderAmount } = req.body;

        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({ message: 'Invalid coupon code' });
        }

        if (!coupon.isValid()) {
            return res.status(400).json({ message: 'Coupon has expired or is not active' });
        }

        if (orderAmount < coupon.minOrderValue) {
            return res.status(400).json({
                message: `Minimum order value of ₹${coupon.minOrderValue} required`
            });
        }

        const discount = coupon.calculateDiscount(orderAmount);

        res.json({
            valid: true,
            code: coupon.code,
            description: coupon.description,
            discount,
            finalAmount: orderAmount - discount
        });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createCoupon,
    getAllCoupons,
    getActiveCoupons,
    getCouponByCode,
    updateCoupon,
    deleteCoupon,
    validateCoupon
};
