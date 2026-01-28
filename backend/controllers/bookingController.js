import Booking from '../models/Booking.js';
import Service from '../models/Service.js';
import { formatResponse, paginateResults } from '../utils/helpers.js';

// @desc    Create booking
// @route   POST /api/bookings
// @access  Private (Customer)
export const createBooking = async (req, res, next) => {
    try {
        const { serviceId, date, timeSlot, notes } = req.body;

        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json(formatResponse(false, 'Service not found'));
        }

        if (!service.isActive) {
            return res.status(400).json(formatResponse(false, 'Service is not available'));
        }

        // Check for existing booking at same time
        const existingBooking = await Booking.findOne({
            serviceId,
            date: new Date(date),
            timeSlot,
            status: { $nin: ['cancelled'] }
        });

        if (existingBooking) {
            return res.status(400).json(formatResponse(false, 'This time slot is already booked'));
        }

        const booking = await Booking.create({
            customerId: req.user._id,
            serviceId,
            providerId: service.providerId,
            date: new Date(date),
            timeSlot,
            notes,
            totalPrice: service.price
        });

        const populatedBooking = await Booking.findById(booking._id)
            .populate('serviceId', 'title price duration category')
            .populate('providerId', 'name email')
            .populate('customerId', 'name email');

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            data: { booking: populatedBooking }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get customer bookings
// @route   GET /api/bookings/my-bookings
// @access  Private (Customer)
export const getMyBookings = async (req, res, next) => {
    try {
        const { page, limit, status } = req.query;
        const { skip, limit: limitNum, page: pageNum } = paginateResults(page, limit);

        const filter = { customerId: req.user._id };
        if (status) filter.status = status;

        const total = await Booking.countDocuments(filter);
        const bookings = await Booking.find(filter)
            .populate('serviceId', 'title price duration category image')
            .populate('providerId', 'name email phone')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        res.status(200).json({
            success: true,
            data: {
                bookings,
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

// @desc    Get provider bookings
// @route   GET /api/bookings/provider-bookings
// @access  Private (Provider)
export const getProviderBookings = async (req, res, next) => {
    try {
        const { page, limit, status } = req.query;
        const { skip, limit: limitNum, page: pageNum } = paginateResults(page, limit);

        const filter = { providerId: req.user._id };
        if (status) filter.status = status;

        const total = await Booking.countDocuments(filter);
        const bookings = await Booking.find(filter)
            .populate('serviceId', 'title price duration category image')
            .populate('customerId', 'name email phone')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        res.status(200).json({
            success: true,
            data: {
                bookings,
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

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('serviceId', 'title description price duration category image')
            .populate('providerId', 'name email phone')
            .populate('customerId', 'name email phone');

        if (!booking) {
            return res.status(404).json(formatResponse(false, 'Booking not found'));
        }

        // Check if user has access to this booking
        const isOwner = booking.customerId._id.toString() === req.user._id.toString() ||
            booking.providerId._id.toString() === req.user._id.toString() ||
            req.user.role === 'admin';

        if (!isOwner) {
            return res.status(403).json(formatResponse(false, 'Not authorized to view this booking'));
        }

        res.status(200).json({
            success: true,
            data: { booking }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private (Provider/Admin)
export const updateBookingStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const validStatuses = ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'];

        if (!validStatuses.includes(status)) {
            return res.status(400).json(formatResponse(false, 'Invalid status'));
        }

        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json(formatResponse(false, 'Booking not found'));
        }

        const isProvider = booking.providerId.toString() === req.user._id.toString();
        const isCustomer = booking.customerId.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isProvider && !isAdmin && !(isCustomer && status === 'cancelled')) {
            return res.status(403).json(formatResponse(false, 'Not authorized to update this booking'));
        }

        booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        )
            .populate('serviceId', 'title price duration category')
            .populate('providerId', 'name email')
            .populate('customerId', 'name email');

        res.status(200).json({
            success: true,
            message: 'Booking status updated successfully',
            data: { booking }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private (Customer - Owner)
export const cancelBooking = async (req, res, next) => {
    try {
        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json(formatResponse(false, 'Booking not found'));
        }

        const isOwner = booking.customerId.toString() === req.user._id.toString();
        const isAdmin = req.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json(formatResponse(false, 'Not authorized to cancel this booking'));
        }

        if (booking.status === 'completed') {
            return res.status(400).json(formatResponse(false, 'Cannot cancel a completed booking'));
        }

        booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status: 'cancelled' },
            { new: true }
        )
            .populate('serviceId', 'title price duration category')
            .populate('providerId', 'name email')
            .populate('customerId', 'name email');

        res.status(200).json({
            success: true,
            message: 'Booking cancelled successfully',
            data: { booking }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings/all
// @access  Private (Admin)
export const getAllBookings = async (req, res, next) => {
    try {
        const { page, limit, status } = req.query;
        const { skip, limit: limitNum, page: pageNum } = paginateResults(page, limit);

        const filter = {};
        if (status) filter.status = status;

        const total = await Booking.countDocuments(filter);
        const bookings = await Booking.find(filter)
            .populate('serviceId', 'title price duration category')
            .populate('providerId', 'name email')
            .populate('customerId', 'name email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        res.status(200).json({
            success: true,
            data: {
                bookings,
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
