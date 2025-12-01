const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        match: /^[0-9]{10}$/
    },
    addressLine1: {
        type: String,
        required: true
    },
    addressLine2: {
        type: String
    },
    landmark: {
        type: String
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    pincode: {
        type: String,
        required: true,
        match: /^[0-9]{6}$/
    },
    country: {
        type: String,
        default: 'India'
    },
    addressType: {
        type: String,
        enum: ['Home', 'Work', 'Other'],
        default: 'Home'
    },
    isDefault: {
        type: Boolean,
        default: false
    },
    isDeliverable: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

// Ensure only one default address per user
addressSchema.pre('save', async function (next) {
    if (this.isDefault) {
        await this.constructor.updateMany(
            { user: this.user, _id: { $ne: this._id } },
            { isDefault: false }
        );
    }
    next();
});

module.exports = mongoose.model('Address', addressSchema);
