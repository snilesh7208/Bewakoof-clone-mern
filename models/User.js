const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    mobile: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin', 'manager'], default: 'user' },

    // Wallet
    wallet: {
        balance: { type: Number, default: 0 },
        transactions: [{
            type: { type: String, enum: ['credit', 'debit'] },
            amount: { type: Number },
            description: { type: String },
            orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
            timestamp: { type: Date, default: Date.now }
        }]
    },

    // Verification
    isEmailVerified: { type: Boolean, default: false },
    isMobileVerified: { type: Boolean, default: false },
    emailOTP: { type: String },
    mobileOTP: { type: String },
    otpExpiry: { type: Date },

    // Social Login
    googleId: { type: String },
    facebookId: { type: String },

    // Account Status
    isBlocked: { type: Boolean, default: false },
    blockedReason: { type: String },

    // Wishlist & Preferences
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],

    // Password Reset
    resetPasswordToken: { type: String },
    resetPasswordExpiry: { type: Date }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
