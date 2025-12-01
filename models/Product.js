const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    sizes: [{ type: String, enum: ['S', 'M', 'L', 'XL'] }],
    stock: { type: Number, required: true, default: 0 },
    images: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
