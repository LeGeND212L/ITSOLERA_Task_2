import express from 'express';
import {
    createService,
    getServices,
    getServiceById,
    updateService,
    deleteService,
    getMyServices,
    getCategories
} from '../controllers/serviceController.js';
import { protect, authorize, checkApproval } from '../middleware/auth.js';
import validate from '../middleware/validate.js';
import { serviceValidation, mongoIdValidation, paginationValidation } from '../utils/validators.js';

const router = express.Router();

// Public routes
router.get('/categories', getCategories);
router.get('/', paginationValidation, validate, getServices);

// Provider routes - MUST be defined before /:id routes to avoid conflicts
router.get('/provider/my-services', protect, authorize('provider'), checkApproval, getMyServices);
router.post('/', protect, authorize('provider'), checkApproval, serviceValidation, validate, createService);

// Routes with :id parameter - must come after specific routes
router.get('/:id', mongoIdValidation, validate, getServiceById);
router.put('/:id', protect, authorize('provider', 'admin'), mongoIdValidation, validate, updateService);
router.delete('/:id', protect, authorize('provider', 'admin'), mongoIdValidation, validate, deleteService);

export default router;
