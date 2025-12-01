const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const User = require('../models/User');
const Product = require('../models/Product');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// GST Rate (18%)
const GST_RATE = 0.18;
const FREE_DELIVERY_THRESHOLD = 999;
const DELIVERY_CHARGES = 99;

// @desc    Create new order (Checkout)
// @route   POST /api/orders/checkout
// @access  Private
const checkout = async (req, res, next) => {
    const { items, address, paymentMethodId, paymentMethod, couponCode } = req.body;

    try {
        // Calculate subtotal
        let subtotal = 0;
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product not found: ${item.product}` });
            }
            subtotal += item.price * item.quantity;
        }

        // Apply coupon if provided
        let discount = 0;
        let couponData = null;
        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
            if (!coupon) {
                return res.status(400).json({ message: 'Invalid coupon code' });
            }
            if (!coupon.isValid()) {
                return res.status(400).json({ message: 'Coupon is expired or not valid' });
            }
            try {
                discount = coupon.calculateDiscount(subtotal);
                couponData = {
                    code: coupon.code,
                    discountAmount: discount
                };
                // Increment usage count
                coupon.usedCount += 1;
                await coupon.save();
            } catch (error) {
                return res.status(400).json({ message: error.message });
            }
        }

        // Calculate delivery charges
        const deliveryCharges = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGES;

        // Calculate GST
        const amountAfterDiscount = subtotal - discount;
        const gst = amountAfterDiscount * GST_RATE;

        // Calculate total
        const totalAmount = amountAfterDiscount + gst + deliveryCharges;

        // Process payment if not COD
        let paymentIntent = null;
        let paymentStatus = 'Pending';
        let paymentId = null;

        if (paymentMethod !== 'COD') {
            try {
                paymentIntent = await stripe.paymentIntents.create({
                    amount: Math.round(totalAmount * 100), // Amount in cents
                    currency: 'inr',
                    payment_method: paymentMethodId,
                    confirm: true,
                    automatic_payment_methods: {
                        enabled: true,
                        allow_redirects: 'never'
                    }
                });
                paymentStatus = paymentIntent.status === 'succeeded' ? 'Paid' : 'Pending';
                paymentId = paymentIntent.id;
            } catch (error) {
                return res.status(400).json({ message: 'Payment failed: ' + error.message });
            }
        } else {
            paymentStatus = 'Pending';
        }

        // Calculate expected delivery date (7 days from now)
        const expectedDeliveryDate = new Date();
        expectedDeliveryDate.setDate(expectedDeliveryDate.getDate() + 7);

        // Create order
        const order = new Order({
            user: req.user._id,
            items,
            subtotal,
            deliveryCharges,
            gst,
            discount,
            totalAmount,
            coupon: couponData,
            paymentStatus,
            paymentMethod: paymentMethod || 'Card',
            paymentId,
            address,
            status: paymentStatus === 'Paid' ? 'confirmed' : 'pending',
            expectedDeliveryDate,
            timeline: [{
                status: 'pending',
                timestamp: new Date(),
                message: 'Order placed successfully'
            }]
        });

        const createdOrder = await order.save();

        // Update product stock
        for (const item of items) {
            const product = await Product.findById(item.product);
            product.stock -= item.quantity;
            await product.save();
        }

        // Clear user's cart
        const Cart = require('../models/Cart');
        await Cart.findOneAndDelete({ user: req.user._id });

        res.status(201).json(createdOrder);

    } catch (error) {
        console.error('Checkout error:', error);
        next(error);
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/user
// @access  Private
const getUserOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.product', 'name images price')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.product', 'name images price')
            .populate('user', 'name email mobile');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user owns this order or is admin
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to view this order' });
        }

        res.json(order);
    } catch (error) {
        next(error);
    }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Check if user owns this order
        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Check if order can be cancelled
        if (!['pending', 'confirmed'].includes(order.status)) {
            return res.status(400).json({ message: 'Order cannot be cancelled at this stage' });
        }

        order.status = 'cancelled';
        order.cancellation = {
            isCancelled: true,
            reason: req.body.reason || 'Cancelled by user',
            cancelledAt: new Date()
        };

        // Process refund if payment was made
        if (order.paymentStatus === 'Paid') {
            order.paymentStatus = 'Refunded';
            order.refund = {
                amount: order.totalAmount,
                method: req.body.refundMethod || 'Original Payment Method',
                status: 'pending',
                processedAt: new Date()
            };

            // Add to wallet if wallet refund selected
            if (req.body.refundMethod === 'Wallet') {
                const user = await User.findById(req.user._id);
                user.wallet.balance += order.totalAmount;
                user.wallet.transactions.push({
                    type: 'credit',
                    amount: order.totalAmount,
                    description: `Refund for cancelled order #${order._id}`,
                    orderId: order._id
                });
                await user.save();
                order.refund.status = 'completed';
            }
        }

        // Restore product stock
        for (const item of order.items) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock += item.quantity;
                await product.save();
            }
        }

        await order.save();
        res.json({ message: 'Order cancelled successfully', order });
    } catch (error) {
        next(error);
    }
};

// @desc    Request return
// @route   PUT /api/orders/:id/return
// @access  Private
const requestReturn = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (order.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        if (order.status !== 'delivered') {
            return res.status(400).json({ message: 'Only delivered orders can be returned' });
        }

        // Check if return window is still open (7 days)
        const deliveryDate = new Date(order.deliveredDate);
        const currentDate = new Date();
        const daysSinceDelivery = Math.floor((currentDate - deliveryDate) / (1000 * 60 * 60 * 24));

        if (daysSinceDelivery > 7) {
            return res.status(400).json({ message: 'Return window has expired (7 days from delivery)' });
        }

        order.returnRequest = {
            isRequested: true,
            reason: req.body.reason,
            status: 'pending',
            requestedAt: new Date()
        };
        order.status = 'returned';

        await order.save();
        res.json({ message: 'Return request submitted successfully', order });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin
// @access  Private/Admin
const getAdminOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({})
            .populate('user', 'name email mobile')
            .populate('items.product', 'name images price')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = req.body.status;

        if (req.body.status === 'delivered') {
            order.deliveredDate = new Date();
        }

        if (req.body.trackingNumber) {
            order.trackingNumber = req.body.trackingNumber;
        }

        await order.save();
        res.json({ message: 'Order status updated', order });
    } catch (error) {
        next(error);
    }
};

// @desc    Apply coupon
// @route   POST /api/orders/apply-coupon
// @access  Private
const applyCoupon = async (req, res, next) => {
    try {
        const { code, orderAmount } = req.body;

        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({ message: 'Invalid coupon code' });
        }

        if (!coupon.isValid()) {
            return res.status(400).json({ message: 'Coupon is expired or not valid' });
        }

        const discount = coupon.calculateDiscount(orderAmount);

        res.json({
            valid: true,
            discount,
            code: coupon.code,
            description: coupon.description
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    checkout,
    getUserOrders,
    getOrderById,
    cancelOrder,
    requestReturn,
    getAdminOrders,
    updateOrderStatus,
    applyCoupon
};
