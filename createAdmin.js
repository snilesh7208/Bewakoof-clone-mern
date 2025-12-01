const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const connectDB = require('./config/database');

dotenv.config();
connectDB();

const createAdmin = async () => {
    try {
        // Check if admin exists
        const adminExists = await User.findOne({ email: 'admin@example.com' });

        if (adminExists) {
            console.log('Admin user already exists!');
            console.log('Email: admin@example.com');
            process.exit();
        }

        const adminUser = new User({
            name: 'Admin User',
            email: 'admin@example.com',
            password: 'adminpassword', // The User model will automatically hash this
            mobile: '0000000000',
            role: 'admin'
        });

        await adminUser.save();

        console.log('Admin user created successfully!');
        console.log('Email: admin@example.com');
        console.log('Password: adminpassword');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

createAdmin();
