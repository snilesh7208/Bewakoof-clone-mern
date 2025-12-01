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

// @desc    Add product review
// @route   POST /api/products/:id/reviews
// @access  Private
const addProductReview = async (req, res) => {
    try {
        const { rating, comment, images } = req.body;

        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if user already reviewed
        const alreadyReviewed = product.reviews.find(
            r => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            return res.status(400).json({ message: 'Product already reviewed' });
        }

        const review = {
            user: req.user._id,
            name: req.user.name,
            rating: Number(rating),
            comment,
            images: images || []
        };

        product.reviews.push(review);
        product.calculateRating();

        await product.save();
        res.status(201).json({ message: 'Review added successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get product reviews
// @route   GET /api/products/:id/reviews
// @access  Public
const getProductReviews = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id).select('reviews rating numReviews');

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({
            reviews: product.reviews,
            rating: product.rating,
            numReviews: product.numReviews
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get similar products
// @route   GET /api/products/:id/similar
// @access  Public
const getSimilarProducts = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Find products in same category, excluding current product
        const similarProducts = await Product.find({
            category: product.category,
            _id: { $ne: product._id },
            isActive: true
        }).limit(8);

        res.json(similarProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    addProductReview,
    getProductReviews,
    getSimilarProducts
};
