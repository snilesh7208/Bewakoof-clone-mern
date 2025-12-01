const Cart = require('../models/Cart');

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
const addToCart = async (req, res) => {
    const { productId, quantity, size } = req.body;
    const userId = req.user._id;

    let cart = await Cart.findOne({ user: userId });

    if (cart) {
        // Cart exists for user
        let itemIndex = cart.items.findIndex(p => p.product == productId && p.size == size);

        if (itemIndex > -1) {
            // Product exists in the cart, update the quantity
            let productItem = cart.items[itemIndex];
            productItem.quantity += quantity;
            cart.items[itemIndex] = productItem;
        } else {
            // Product does not exist in cart, add new item
            cart.items.push({ product: productId, quantity, size });
        }
        cart = await cart.save();
        return res.status(201).json(cart);
    } else {
        // No cart for user, create new cart
        const newCart = await Cart.create({
            user: userId,
            items: [{ product: productId, quantity, size }]
        });
        return res.status(201).json(newCart);
    }
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
const getCart = async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (cart) {
        res.json(cart);
    } else {
        res.json({ items: [] });
    }
};

// @desc    Update cart item
// @route   PUT /api/cart/update
// @access  Private
const updateCartItem = async (req, res) => {
    const { productId, quantity, size } = req.body;
    const userId = req.user._id;

    let cart = await Cart.findOne({ user: userId });

    if (cart) {
        let itemIndex = cart.items.findIndex(p => p.product == productId && p.size == size);

        if (itemIndex > -1) {
            let productItem = cart.items[itemIndex];
            productItem.quantity = quantity;
            cart.items[itemIndex] = productItem;
            cart = await cart.save();
            res.json(cart);
        } else {
            res.status(404);
            throw new Error('Item not found in cart');
        }
    } else {
        res.status(404);
        throw new Error('Cart not found');
    }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:id
// @access  Private
const removeFromCart = async (req, res) => {
    const userId = req.user._id;
    const itemId = req.params.id; // This should be the item's _id in the array

    let cart = await Cart.findOne({ user: userId });

    if (cart) {
        cart.items = cart.items.filter(item => item._id.toString() !== itemId);
        cart = await cart.save();
        res.json(cart);
    } else {
        res.status(404);
        throw new Error('Cart not found');
    }
};

module.exports = { addToCart, getCart, updateCartItem, removeFromCart };
