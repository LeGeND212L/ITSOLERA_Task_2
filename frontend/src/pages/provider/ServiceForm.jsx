import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiArrowLeft, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { createService, updateService, fetchServiceById, clearService } from '../../redux/slices/serviceSlice';
import Loader from '../../components/common/Loader';

const ServiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { service, loading } = useSelector((state) => state.services);
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    duration: '',
    category: '',
    isActive: true,
  });

  const categories = [
    { value: 'web-development', label: 'Web Development' },
    { value: 'mobile-development', label: 'Mobile Development' },
    { value: 'ui-ux-design', label: 'UI/UX Design' },
    { value: 'cloud-services', label: 'Cloud Services' },
    { value: 'data-analytics', label: 'Data Analytics' },
    { value: 'cybersecurity', label: 'Cybersecurity' },
    { value: 'ai-ml', label: 'AI & Machine Learning' },
    { value: 'consulting', label: 'IT Consulting' },
    { value: 'maintenance', label: 'Maintenance & Support' },
    { value: 'other', label: 'Other Services' },
  ];

  useEffect(() => {
    if (isEdit) {
      dispatch(fetchServiceById(id));
    }
    return () => {
      dispatch(clearService());
    };
  }, [dispatch, id, isEdit]);

  useEffect(() => {
    if (service && isEdit) {
      setFormData({
        title: service.title || '',
        description: service.description || '',
        price: service.price || '',
        duration: service.duration || '',
        category: service.category || '',
        isActive: service.isActive ?? true,
      });
    }
  }, [service, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.price || !formData.duration || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    const serviceData = {
      ...formData,
      price: parseFloat(formData.price),
      duration: parseInt(formData.duration),
    };

    let result;
    if (isEdit) {
      result = await dispatch(updateService({ id, serviceData }));
      if (updateService.fulfilled.match(result)) {
        toast.success('Service updated successfully');
        navigate('/provider/services');
      } else {
        toast.error(result.payload || 'Failed to update service');
      }
    } else {
      result = await dispatch(createService(serviceData));
      if (createService.fulfilled.match(result)) {
        toast.success('Service created successfully');
        navigate('/provider/services');
      } else {
        toast.error(result.payload || 'Failed to create service');
      }
    }
  };

  if (isEdit && loading && !service) {
    return (
      <div className="flex justify-center py-12">
        <Loader size="lg" text="Loading service..." />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <button
        onClick={() => navigate('/provider/services')}
        className="inline-flex items-center gap-2 text-dark-400 hover:text-white mb-6 transition-colors"
      >
        <FiArrowLeft />
        Back to Services
      </button>

      <div className="card">
        <h1 className="text-2xl font-bold text-white mb-6">
          {isEdit ? 'Edit Service' : 'Add New Service'}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="label" htmlFor="title">Service Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input"
              placeholder="e.g., Full Stack Web Development"
              required
            />
          </div>

          <div>
            <label className="label" htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="input resize-none"
              placeholder="Describe your service in detail..."
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label" htmlFor="price">Price ($) *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="input"
                placeholder="99.99"
                required
              />
            </div>

            <div>
              <label className="label" htmlFor="duration">Duration (minutes) *</label>
              <input
                type="number"
                id="duration"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="15"
                step="15"
                className="input"
                placeholder="60"
                required
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="isActive"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-5 h-5 rounded bg-dark-800 border-dark-600 text-cyber-500 focus:ring-cyber-500"
            />
            <label htmlFor="isActive" className="text-dark-200">
              Service is active and visible to customers
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => navigate('/provider/services')}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1"
            >
              {loading ? (
                <Loader size="sm" />
              ) : (
                <>
                  <FiSave />
                  {isEdit ? 'Update Service' : 'Create Service'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceForm;
