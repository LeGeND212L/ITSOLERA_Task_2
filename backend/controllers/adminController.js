import User from '../models/User.js';
import Service from '../models/Service.js';
import Booking from '../models/Booking.js';
import { formatResponse, paginateResults } from '../utils/helpers.js';

// @desc    Get dashboard stats
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
export const getDashboardStats = async (req, res, next) => {
    try {
        const [
            totalUsers,
            totalProviders,
            totalCustomers,
            pendingProviders,
            totalServices,
            activeServices,
            totalBookings,
            pendingBookings,
            completedBookings,
            cancelledBookings
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ role: 'provider' }),
            User.countDocuments({ role: 'customer' }),
            User.countDocuments({ role: 'provider', isApproved: false }),
            Service.countDocuments(),
            Service.countDocuments({ isActive: true }),
            Booking.countDocuments(),
            Booking.countDocuments({ status: 'pending' }),
            Booking.countDocuments({ status: 'completed' }),
            Booking.countDocuments({ status: 'cancelled' })
        ]);

        // Get recent bookings
        const recentBookings = await Booking.find()
            .populate('serviceId', 'title')
            .populate('customerId', 'name')
            .populate('providerId', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        // Get revenue
        const revenueData = await Booking.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, totalRevenue: { $sum: '$totalPrice' } } }
        ]);

        const totalRevenue = revenueData[0]?.totalRevenue || 0;

        res.status(200).json({
            success: true,
            data: {
                users: { total: totalUsers, providers: totalProviders, customers: totalCustomers, pendingProviders },
                services: { total: totalServices, active: activeServices },
                bookings: { total: totalBookings, pending: pendingBookings, completed: completedBookings, cancelled: cancelledBookings },
                revenue: totalRevenue,
                recentBookings
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
export const getAllUsers = async (req, res, next) => {
    try {
        const { page, limit, role, search } = req.query;
        const { skip, limit: limitNum, page: pageNum } = paginateResults(page, limit);

        const filter = {};
        if (role) filter.role = role;
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const total = await User.countDocuments(filter);
        const users = await User.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        res.status(200).json({
            success: true,
            data: {
                users,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    pages: Math.ceil(total / limitNum)
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get pending providers
// @route   GET /api/admin/providers/pending
// @access  Private (Admin)
export const getPendingProviders = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const { skip, limit: limitNum, page: pageNum } = paginateResults(page, limit);

        const filter = { role: 'provider', isApproved: false };
        const total = await User.countDocuments(filter);
        const providers = await User.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        res.status(200).json({
            success: true,
            data: {
                providers,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    pages: Math.ceil(total / limitNum)
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Approve provider
// @route   PUT /api/admin/providers/:id/approve
// @access  Private (Admin)
export const approveProvider = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json(formatResponse(false, 'User not found'));
        }

        if (user.role !== 'provider') {
            return res.status(400).json(formatResponse(false, 'User is not a service provider'));
        }

        user.isApproved = true;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Provider approved successfully',
            data: { user }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Reject provider
// @route   PUT /api/admin/providers/:id/reject
// @access  Private (Admin)
export const rejectProvider = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json(formatResponse(false, 'User not found'));
        }

        if (user.role !== 'provider') {
            return res.status(400).json(formatResponse(false, 'User is not a service provider'));
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json(formatResponse(true, 'Provider rejected and removed'));
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json(formatResponse(false, 'User not found'));
        }

        if (user.role === 'admin') {
            return res.status(400).json(formatResponse(false, 'Cannot delete admin user'));
        }

        await User.findByIdAndDelete(req.params.id);

        // Also delete related data
        if (user.role === 'provider') {
            await Service.deleteMany({ providerId: user._id });
            await Booking.deleteMany({ providerId: user._id });
        } else if (user.role === 'customer') {
            await Booking.deleteMany({ customerId: user._id });
        }

        res.status(200).json(formatResponse(true, 'User deleted successfully'));
    } catch (error) {
        next(error);
    }
};

// @desc    Get all services (Admin)
// @route   GET /api/admin/services
// @access  Private (Admin)
export const getAdminServices = async (req, res, next) => {
    try {
        const { page, limit, category, search } = req.query;
        const { skip, limit: limitNum, page: pageNum } = paginateResults(page, limit);

        const filter = {};
        if (category) filter.category = category;
        if (search) {
            filter.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const total = await Service.countDocuments(filter);
        const services = await Service.find(filter)
            .populate('providerId', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        res.status(200).json({
            success: true,
            data: {
                services,
                pagination: {
                    page: pageNum,
                    limit: limitNum,
                    total,
                    pages: Math.ceil(total / limitNum)
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Seed sample services to database
// @route   POST /api/admin/seed-services
// @access  Private (Admin)
export const seedServices = async (req, res, next) => {
    try {
        // Check if services already exist
        const existingCount = await Service.countDocuments();
        if (existingCount > 0) {
            return res.status(400).json({
                success: false,
                message: `Database already has ${existingCount} services. Clear them first if you want to reseed.`
            });
        }

        // Find or create a provider user for the sample services
        let provider = await User.findOne({ role: 'provider', isApproved: true });

        if (!provider) {
            // Create a sample provider
            provider = await User.create({
                name: 'Tech Solutions Pro',
                email: 'provider@apexbooking.com',
                password: 'Provider@123',
                role: 'provider',
                phone: '03001234567',
                isApproved: true
            });
        }

        // Sample services data
        const servicesData = [
            {
                title: 'Professional Website Development',
                description: 'Custom website development with modern technologies like React, Vue, or Angular. Includes responsive design, SEO optimization, and fast loading speeds.',
                category: 'web-development',
                price: 999,
                duration: 120,
                providerId: provider._id,
                isActive: true
            },
            {
                title: 'Mobile App Development - iOS & Android',
                description: 'Native or cross-platform mobile app development using React Native or Flutter. Full-featured apps with backend integration.',
                category: 'mobile-development',
                price: 1499,
                duration: 180,
                providerId: provider._id,
                isActive: true
            },
            {
                title: 'UI/UX Design for Web & Mobile',
                description: 'Professional UI/UX design services including wireframing, prototyping, and high-fidelity designs. User-centered approach with modern design principles.',
                category: 'ui-ux-design',
                price: 799,
                duration: 90,
                providerId: provider._id,
                isActive: true
            },
            {
                title: 'Cloud Migration & Setup - AWS/Azure',
                description: 'Migrate your applications to the cloud with AWS or Azure. Includes server setup, database migration, and optimization.',
                category: 'cloud-services',
                price: 1299,
                duration: 150,
                providerId: provider._id,
                isActive: true
            },
            {
                title: 'Data Analytics & Business Intelligence',
                description: 'Transform your data into actionable insights. Data visualization, dashboard creation, and predictive analytics using modern tools.',
                category: 'data-analytics',
                price: 899,
                duration: 120,
                providerId: provider._id,
                isActive: true
            },
            {
                title: 'Cybersecurity Audit & Consultation',
                description: 'Comprehensive security audit of your systems. Vulnerability assessment, penetration testing, and security recommendations.',
                category: 'cybersecurity',
                price: 1599,
                duration: 180,
                providerId: provider._id,
                isActive: true
            },
            {
                title: 'AI Chatbot Development',
                description: 'Custom AI-powered chatbot development for customer service. Natural language processing and integration with your existing systems.',
                category: 'ai-ml',
                price: 1199,
                duration: 150,
                providerId: provider._id,
                isActive: true
            },
            {
                title: 'IT Consulting & Strategy',
                description: 'Expert IT consulting services to help you make strategic technology decisions. Technology roadmap, vendor selection, and implementation planning.',
                category: 'consulting',
                price: 699,
                duration: 90,
                providerId: provider._id,
                isActive: true
            },
            {
                title: 'Website Maintenance & Support',
                description: '24/7 website maintenance and support services. Regular updates, bug fixes, performance monitoring, and security patches.',
                category: 'maintenance',
                price: 499,
                duration: 60,
                providerId: provider._id,
                isActive: true
            },
            {
                title: 'E-commerce Store Development',
                description: 'Full-featured e-commerce store with payment gateway integration, inventory management, and order tracking. Built with Shopify, WooCommerce, or custom.',
                category: 'web-development',
                price: 1799,
                duration: 200,
                providerId: provider._id,
                isActive: true
            },
            {
                title: 'API Development & Integration',
                description: 'RESTful API development and third-party API integration services. Secure, scalable, and well-documented APIs.',
                category: 'web-development',
                price: 899,
                duration: 120,
                providerId: provider._id,
                isActive: true
            },
            {
                title: 'Database Design & Optimization',
                description: 'Database architecture design and performance optimization. MySQL, PostgreSQL, MongoDB expertise with query optimization.',
                category: 'consulting',
                price: 799,
                duration: 90,
                providerId: provider._id,
                isActive: true
            }
        ];

        // Insert all services
        const services = await Service.insertMany(servicesData);

        res.status(201).json({
            success: true,
            message: `Successfully seeded ${services.length} services`,
            data: {
                count: services.length,
                provider: {
                    name: provider.name,
                    email: provider.email
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Clear all services (for reseeding)
// @route   DELETE /api/admin/clear-services
// @access  Private (Admin)
export const clearServices = async (req, res, next) => {
    try {
        const result = await Service.deleteMany({});

        res.status(200).json({
            success: true,
            message: `Successfully deleted ${result.deletedCount} services`
        });
    } catch (error) {
        next(error);
    }
};
