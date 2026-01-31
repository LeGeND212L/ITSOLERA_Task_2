import express from 'express';
import {
    getDashboardStats,
    getAllUsers,
    getPendingProviders,
    approveProvider,
    rejectProvider,
    deleteUser,
    getAdminServices,
    seedServices,
    clearServices
} from '../controllers/adminController.js';
import { getAllBookings } from '../controllers/bookingController.js';
import { protect, authorize } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { mongoIdValidation, paginationValidation } from '../utils/validators.js';

const router = express.Router();

// All routes require admin authentication
router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/dashboard', getDashboardStats);

// User management
router.get('/users', paginationValidation, validate, getAllUsers);
router.delete('/users/:id', mongoIdValidation, validate, deleteUser);

// Provider approval
router.get('/providers/pending', paginationValidation, validate, getPendingProviders);
router.put('/providers/:id/approve', mongoIdValidation, validate, approveProvider);
router.put('/providers/:id/reject', mongoIdValidation, validate, rejectProvider);

// Services management
router.get('/services', paginationValidation, validate, getAdminServices);
router.post('/seed-services', seedServices);
router.delete('/clear-services', clearServices);

// Bookings management
router.get('/bookings', paginationValidation, validate, getAllBookings);

export default router;
