import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'dns';
import User from './models/User.js';

// Load environment variables
dotenv.config();

// Fix for MongoDB connection - same as server.js
dns.setDefaultResultOrder('ipv4first');
try {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
    console.log('DNS resolver configured');
} catch (error) {
    console.log('Using system default DNS');
}

const seedAdmin = async () => {
    try {
        // Connect to MongoDB using same method as server
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected...');

        // Check if admin already exists
        const adminExists = await User.findOne({ email: 'Admin123@gmail.com' });

        if (adminExists) {
            console.log('Admin user already exists!');
            console.log('Email: Admin123@gmail.com');
            console.log('Password: Admin123@');
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create({
            name: 'Admin',
            email: 'Admin123@gmail.com',
            password: 'Admin123@',
            phone: '1234567890',
            role: 'admin',
            isApproved: true,
            isActive: true
        });

        console.log('✅ Admin user created successfully!');
        console.log('=================================');
        console.log('Email: Admin123@gmail.com');
        console.log('Password: Admin123@');
        console.log('=================================');

        process.exit(0);
    } catch (error) {
        console.error('Error seeding admin:', error.message);
        process.exit(1);
    }
};

seedAdmin();
