import express from 'express';
import {
    createBooking,
    getMyBookings,
    getProviderBookings,
    getBookingById,
    updateBookingStatus,
    cancelBooking,
    getAllBookings
} from '../controllers/bookingController.js';
import { protect, authorize, checkApproval } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { bookingValidation, mongoIdValidation, paginationValidation } from '../utils/validators.js';

const router = express.Router();

// Customer routes
router.post('/', protect, authorize('customer'), bookingValidation, validate, createBooking);
router.get('/my-bookings', protect, authorize('customer'), paginationValidation, validate, getMyBookings);
router.put('/:id/cancel', protect, authorize('customer', 'admin'), mongoIdValidation, validate, cancelBooking);

// Provider routes
router.get('/provider-bookings', protect, authorize('provider'), checkApproval, paginationValidation, validate, getProviderBookings);
router.put('/:id/status', protect, authorize('provider', 'admin'), mongoIdValidation, validate, updateBookingStatus);

// Admin routes
router.get('/all', protect, authorize('admin'), paginationValidation, validate, getAllBookings);

// Common routes
router.get('/:id', protect, mongoIdValidation, validate, getBookingById);

export default router;
