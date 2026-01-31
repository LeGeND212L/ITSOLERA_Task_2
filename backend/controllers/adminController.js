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
