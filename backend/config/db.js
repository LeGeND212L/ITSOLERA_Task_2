import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        // Mongoose 6+ uses Node.js native DNS by default
        // Force use of Node.js dns.resolve for better compatibility
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000,
            socketTimeoutMS: 45000,
            family: 4, // Force IPv4
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Database Connection Error: ${error.message}`);
        console.error('Please check:');
        console.error('1. MongoDB Atlas IP whitelist includes your IP');
        console.error('2. Username and password are correct');
        console.error('3. Network/firewall is not blocking the connection');
        process.exit(1);
    }
};

export default connectDB;
