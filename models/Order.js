const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
        {
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            quantity: { type: Number, required: true },
            size: { type: String, required: true },
            price: { type: Number, required: true }
        }
    ],

    // Pricing Details
    subtotal: { type: Number, required: true },
    deliveryCharges: { type: Number, default: 0 },
    gst: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },

    // Coupon
    coupon: {
        code: { type: String },
        discountAmount: { type: Number, default: 0 }
    },

    // Payment Details
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
        default: 'Pending'
    },
    paymentMethod: {
        type: String,
        enum: ['Card', 'UPI', 'Wallet', 'NetBanking', 'COD'],
        default: 'Card'
    },
    paymentId: { type: String },

    // Address
    address: {
        name: { type: String, required: true },
        phone: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        country: { type: String, default: 'India' }
    },

    // Order Status & Tracking
    status: {
        type: String,
        enum: [
            'pending',
            'confirmed',
            'packed',
            'shipped',
            'out for delivery',
            'delivered',
            'cancelled',
            'returned',
            'refunded'
        ],
        default: 'pending'
    },

    // Tracking Timeline
    timeline: [
        {
            status: { type: String },
            timestamp: { type: Date, default: Date.now },
            message: { type: String }
        }
    ],

    // Delivery Details
    expectedDeliveryDate: { type: Date },
    deliveredDate: { type: Date },
    trackingNumber: { type: String },

    // Cancel/Return/Replace
    cancellation: {
        isCancelled: { type: Boolean, default: false },
        reason: { type: String },
        cancelledAt: { type: Date }
    },

    returnRequest: {
        isRequested: { type: Boolean, default: false },
        reason: { type: String },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'picked up', 'completed'],
            default: 'pending'
        },
        requestedAt: { type: Date },
        pickupDate: { type: Date }
    },

    replaceRequest: {
        isRequested: { type: Boolean, default: false },
        reason: { type: String },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'picked up', 'completed'],
            default: 'pending'
        },
        requestedAt: { type: Date }
    },

    // Refund Details
    refund: {
        amount: { type: Number, default: 0 },
        method: { type: String, enum: ['Original Payment Method', 'Wallet'], default: 'Original Payment Method' },
        status: { type: String, enum: ['pending', 'processed', 'completed'], default: 'pending' },
        processedAt: { type: Date }
    },

    // Invoice
    invoice: {
        invoiceNumber: { type: String },
        invoiceUrl: { type: String },
        generatedAt: { type: Date }
    },

    // Admin Notes
    adminNotes: { type: String }

}, { timestamps: true });

// Add timeline entry when status changes
orderSchema.pre('save', async function () {
    if (this.isModified('status')) {
        this.timeline.push({
            status: this.status,
            timestamp: new Date(),
            message: `Order ${this.status}`
        });
    }
});

module.exports = mongoose.model('Order', orderSchema);
