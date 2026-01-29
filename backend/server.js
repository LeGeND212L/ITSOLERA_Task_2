import dns from 'dns';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Load env vars
dotenv.config();

// Fix DNS resolver for Windows (helps with MongoDB SRV connections)
dns.setDefaultResultOrder('ipv4first');
try {
    dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
    console.log('DNS resolver configured with Google/Cloudflare DNS');
} catch (error) {
    console.log('Using system default DNS resolver');
}

// Connect to database
connectDB();

const app = express();

// Middleware - Updated CORS for Vercel deployment
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1 || origin.endsWith('.vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ success: true, message: 'Apex Booking API is running' });
});

// Root route
app.get('/', (req, res) => {
    res.status(200).json({ success: true, message: 'Apex Booking API - Welcome!' });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Only listen when not in Vercel (Vercel handles this automatically)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
