const Order = require('../models/Order');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create new order (Checkout)
// @route   POST /api/orders/checkout
// @access  Private
const checkout = async (req, res) => {
    const { items, totalAmount, address, paymentMethodId } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount * 100, // Amount in cents
            currency: 'inr',
            payment_method: paymentMethodId,
            confirm: true,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never'
            }
        });

        const order = new Order({
            user: req.user._id,
            items,
            totalAmount,
            paymentStatus: paymentIntent.status === 'succeeded' ? 'Paid' : 'Pending',
            paymentId: paymentIntent.id,
            address,
            status: 'confirmed'
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);

    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/user
// @access  Private
const getUserOrders = async (req, res) => {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders/admin
// @access  Private/Admin
const getAdminOrders = async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
};

module.exports = { checkout, getUserOrders, getAdminOrders };
