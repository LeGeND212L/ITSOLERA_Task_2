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
router.get('/:id', mongoIdValidation, validate, getServiceById);

// Provider routes
router.post('/', protect, authorize('provider'), checkApproval, serviceValidation, validate, createService);
router.get('/provider/my-services', protect, authorize('provider'), checkApproval, getMyServices);
router.put('/:id', protect, authorize('provider', 'admin'), mongoIdValidation, validate, updateService);
router.delete('/:id', protect, authorize('provider', 'admin'), mongoIdValidation, validate, deleteService);

export default router;
