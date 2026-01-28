import Service from '../models/Service.js';
import { formatResponse, paginateResults } from '../utils/helpers.js';

// @desc    Create service
// @route   POST /api/services
// @access  Private (Provider)
export const createService = async (req, res, next) => {
    try {
        const { title, description, price, duration, category, image } = req.body;

        const service = await Service.create({
            title,
            description,
            price,
            duration,
            category,
            image,
            providerId: req.user._id
        });

        res.status(201).json({
            success: true,
            message: 'Service created successfully',
            data: { service }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all services
// @route   GET /api/services
// @access  Public
export const getServices = async (req, res, next) => {
    try {
        const { page, limit, category, search, minPrice, maxPrice } = req.query;
        const { skip, limit: limitNum, page: pageNum } = paginateResults(page, limit);

        const filter = { isActive: true };

        if (category) filter.category = category;
        if (minPrice) filter.price = { ...filter.price, $gte: parseFloat(minPrice) };
        if (maxPrice) filter.price = { ...filter.price, $lte: parseFloat(maxPrice) };
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

// @desc    Get service by ID
// @route   GET /api/services/:id
// @access  Public
export const getServiceById = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id)
            .populate('providerId', 'name email phone');

        if (!service) {
            return res.status(404).json(formatResponse(false, 'Service not found'));
        }

        res.status(200).json({
            success: true,
            data: { service }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update service
// @route   PUT /api/services/:id
// @access  Private (Provider - Owner)
export const updateService = async (req, res, next) => {
    try {
        let service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json(formatResponse(false, 'Service not found'));
        }

        if (service.providerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json(formatResponse(false, 'Not authorized to update this service'));
        }

        const { title, description, price, duration, category, image, isActive } = req.body;

        service = await Service.findByIdAndUpdate(
            req.params.id,
            { title, description, price, duration, category, image, isActive },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Service updated successfully',
            data: { service }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete service
// @route   DELETE /api/services/:id
// @access  Private (Provider - Owner)
export const deleteService = async (req, res, next) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            return res.status(404).json(formatResponse(false, 'Service not found'));
        }

        if (service.providerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json(formatResponse(false, 'Not authorized to delete this service'));
        }

        await Service.findByIdAndDelete(req.params.id);

        res.status(200).json(formatResponse(true, 'Service deleted successfully'));
    } catch (error) {
        next(error);
    }
};

// @desc    Get provider's services
// @route   GET /api/services/provider/my-services
// @access  Private (Provider)
export const getMyServices = async (req, res, next) => {
    try {
        const { page, limit } = req.query;
        const { skip, limit: limitNum, page: pageNum } = paginateResults(page, limit);

        const total = await Service.countDocuments({ providerId: req.user._id });
        const services = await Service.find({ providerId: req.user._id })
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

// @desc    Get all categories
// @route   GET /api/services/categories
// @access  Public
export const getCategories = async (req, res, next) => {
    try {
        const categories = [
            { value: 'web-development', label: 'Web Development', icon: '🌐' },
            { value: 'mobile-development', label: 'Mobile Development', icon: '📱' },
            { value: 'ui-ux-design', label: 'UI/UX Design', icon: '🎨' },
            { value: 'cloud-services', label: 'Cloud Services', icon: '☁️' },
            { value: 'data-analytics', label: 'Data Analytics', icon: '📊' },
            { value: 'cybersecurity', label: 'Cybersecurity', icon: '🔒' },
            { value: 'ai-ml', label: 'AI & Machine Learning', icon: '🤖' },
            { value: 'consulting', label: 'IT Consulting', icon: '💼' },
            { value: 'maintenance', label: 'Maintenance & Support', icon: '🔧' },
            { value: 'other', label: 'Other Services', icon: '📦' }
        ];

        res.status(200).json({
            success: true,
            data: { categories }
        });
    } catch (error) {
        next(error);
    }
};
