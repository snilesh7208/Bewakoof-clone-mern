const mongoose = require('mongoose');

const couponSchema = mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true
    },
    discountValue: {
        type: Number,
        required: true
    },
    minOrderValue: {
        type: Number,
        default: 0
    },
    maxDiscount: {
        type: Number
    },
    usageLimit: {
        type: Number,
        default: null // null means unlimited
    },
    usedCount: {
        type: Number,
        default: 0
    },
    validFrom: {
        type: Date,
        required: true
    },
    validUntil: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    applicableCategories: [{
        type: String
    }],
    applicableProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    }],
    userRestrictions: {
        newUsersOnly: { type: Boolean, default: false },
        specificUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

// Method to check if coupon is valid
couponSchema.methods.isValid = function () {
    const now = new Date();
    return (
        this.isActive &&
        now >= this.validFrom &&
        now <= this.validUntil &&
        (this.usageLimit === null || this.usedCount < this.usageLimit)
    );
};

// Method to calculate discount
couponSchema.methods.calculateDiscount = function (orderAmount) {
    if (!this.isValid()) {
        throw new Error('Coupon is not valid');
    }

    if (orderAmount < this.minOrderValue) {
        throw new Error(`Minimum order value of ₹${this.minOrderValue} required`);
    }

    let discount = 0;
    if (this.discountType === 'percentage') {
        discount = (orderAmount * this.discountValue) / 100;
        if (this.maxDiscount && discount > this.maxDiscount) {
            discount = this.maxDiscount;
        }
    } else {
        discount = this.discountValue;
    }

    return Math.min(discount, orderAmount);
};

module.exports = mongoose.model('Coupon', couponSchema);
