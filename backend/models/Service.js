import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Service title is required'],
        trim: true,
        maxlength: [100, 'Title cannot exceed 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
        maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
    },
    duration: {
        type: Number,
        required: [true, 'Duration is required'],
        min: [15, 'Duration must be at least 15 minutes']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['web-development', 'mobile-development', 'ui-ux-design', 'cloud-services', 'data-analytics', 'cybersecurity', 'ai-ml', 'consulting', 'maintenance', 'other']
    },
    providerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    image: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

serviceSchema.index({ title: 'text', description: 'text' });
serviceSchema.index({ providerId: 1, isActive: 1 });

const Service = mongoose.model('Service', serviceSchema);

export default Service;
