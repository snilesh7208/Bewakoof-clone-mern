const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    brand: { type: String },
    price: { type: Number, required: true },
    discountPrice: { type: Number },

    // Size & Stock Management
    sizes: [{ type: String, enum: ['S', 'M', 'L', 'XL', 'XXL', 'Free Size'] }],
    stock: { type: Number, required: true, default: 0 },
    stockBySize: [{
        size: { type: String },
        quantity: { type: Number, default: 0 }
    }],

    // Colors
    colors: [{ type: String }],

    // Images
    images: [{ type: String }],

    // Reviews & Ratings
    reviews: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        name: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
        images: [{ type: String }],
        createdAt: { type: Date, default: Date.now }
    }],

    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },

    // Product Status
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },

    // SEO
    slug: { type: String, unique: true },
    metaTitle: { type: String },
    metaDescription: { type: String }
}, { timestamps: true });

// Calculate average rating
productSchema.methods.calculateRating = function () {
    if (this.reviews.length === 0) {
        this.rating = 0;
        this.numReviews = 0;
    } else {
        const totalRating = this.reviews.reduce((acc, review) => acc + review.rating, 0);
        this.rating = totalRating / this.reviews.length;
        this.numReviews = this.reviews.length;
    }
};

module.exports = mongoose.model('Product', productSchema);
