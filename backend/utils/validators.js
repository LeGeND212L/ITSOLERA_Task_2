import { body, param, query } from 'express-validator';

export const registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role')
        .optional()
        .isIn(['customer', 'provider']).withMessage('Invalid role')
];

export const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email'),
    body('password')
        .notEmpty().withMessage('Password is required')
];

export const serviceValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ max: 1000 }).withMessage('Description cannot exceed 1000 characters'),
    body('price')
        .notEmpty().withMessage('Price is required')
        .isNumeric().withMessage('Price must be a number')
        .custom(val => val >= 0).withMessage('Price cannot be negative'),
    body('duration')
        .notEmpty().withMessage('Duration is required')
        .isNumeric().withMessage('Duration must be a number')
        .custom(val => val >= 15).withMessage('Duration must be at least 15 minutes'),
    body('category')
        .notEmpty().withMessage('Category is required')
        .isIn(['web-development', 'mobile-development', 'ui-ux-design', 'cloud-services', 'data-analytics', 'cybersecurity', 'ai-ml', 'consulting', 'maintenance', 'other'])
        .withMessage('Invalid category')
];

export const bookingValidation = [
    body('serviceId')
        .notEmpty().withMessage('Service ID is required')
        .isMongoId().withMessage('Invalid service ID'),
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Invalid date format'),
    body('timeSlot')
        .trim()
        .notEmpty().withMessage('Time slot is required'),
    body('notes')
        .optional()
        .trim()
        .isLength({ max: 500 }).withMessage('Notes cannot exceed 500 characters')
];

export const mongoIdValidation = [
    param('id')
        .isMongoId().withMessage('Invalid ID format')
];

export const paginationValidation = [
    query('page')
        .optional()
        .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100')
];
