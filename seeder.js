const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const connectDB = require('./config/database');

dotenv.config();
connectDB();

const products = [
    {
        name: "Men's Classic T-Shirt",
        description: "A comfortable and stylish classic t-shirt for men.",
        category: "Men",
        price: 499,
        discountPrice: 399,
        sizes: ["S", "M", "L", "XL"],
        stock: 50,
        images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"]
    },
    {
        name: "Men's Denim Jacket",
        description: "Rugged and cool denim jacket for everyday wear.",
        category: "Men",
        price: 1499,
        discountPrice: 1299,
        sizes: ["M", "L", "XL"],
        stock: 30,
        images: ["https://images.unsplash.com/photo-1495105787522-5334e3ffa0ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"]
    },
    {
        name: "Men's Chino Shorts",
        description: "Casual chino shorts perfect for summer.",
        category: "Men",
        price: 799,
        discountPrice: 699,
        sizes: ["S", "M", "L"],
        stock: 40,
        images: ["https://images.unsplash.com/photo-1591195853828-11db59a44f6b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"]
    },
    {
        name: "Women's Floral Dress",
        description: "Beautiful floral dress for a sunny day.",
        category: "Women",
        price: 1299,
        discountPrice: 999,
        sizes: ["S", "M", "L"],
        stock: 25,
        images: ["https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"]
    },
    {
        name: "Women's Skinny Jeans",
        description: "Stylish skinny jeans that fit perfectly.",
        category: "Women",
        price: 1199,
        discountPrice: 899,
        sizes: ["S", "M", "L", "XL"],
        stock: 35,
        images: ["https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"]
    },
    {
        name: "Women's Crop Top",
        description: "Trendy crop top for a modern look.",
        category: "Women",
        price: 599,
        discountPrice: 449,
        sizes: ["S", "M", "L"],
        stock: 60,
        images: ["https://images.unsplash.com/photo-1503342394128-c104d54dba01?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"]
    },
    {
        name: "iPhone 13 Pro Case",
        description: "Durable and stylish case for iPhone 13 Pro.",
        category: "Mobile Covers",
        price: 399,
        discountPrice: 299,
        sizes: [],
        stock: 100,
        images: ["https://images.unsplash.com/photo-1586105251261-72a756497a11?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"]
    },
    {
        name: "Samsung Galaxy S21 Case",
        description: "Protective case for Samsung Galaxy S21.",
        category: "Mobile Covers",
        price: 349,
        discountPrice: 249,
        sizes: [],
        stock: 80,
        images: ["https://images.unsplash.com/photo-1603313011101-320f26a4f6f6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"]
    },
    {
        name: "Abstract Art Mobile Cover",
        description: "Artistic mobile cover for various models.",
        category: "Mobile Covers",
        price: 299,
        discountPrice: 199,
        sizes: [],
        stock: 120,
        images: ["https://images.unsplash.com/photo-1512054502232-10a0a035d672?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"]
    }
];

const importData = async () => {
    try {
        await Product.deleteMany(); // Clear existing products
        await Product.insertMany(products);
        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

importData();
