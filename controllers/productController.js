const Product = require('../models/Product');

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
    const { name, description, category, price, discountPrice, sizes, stock, images } = req.body;

    const product = new Product({
        name,
        description,
        category,
        price,
        discountPrice,
        sizes,
        stock,
        images
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    const { category, size, minPrice, maxPrice, search } = req.query;
    let query = {};

    if (category) {
        query.category = category;
    }

    if (size) {
        query.sizes = size;
    }

    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }

    const products = await Product.find(query);
    res.json(products);
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
    const { name, description, category, price, discountPrice, sizes, stock, images } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name || product.name;
        product.description = description || product.description;
        product.category = category || product.category;
        product.price = price || product.price;
        product.discountPrice = discountPrice || product.discountPrice;
        product.sizes = sizes || product.sizes;
        product.stock = stock || product.stock;
        product.images = images || product.images;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await product.deleteOne();
        res.json({ message: 'Product removed' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
};

module.exports = { createProduct, getProducts, getProductById, updateProduct, deleteProduct };
