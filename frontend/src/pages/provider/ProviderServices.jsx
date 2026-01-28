import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiDollarSign, FiClock, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { fetchMyServices, deleteService, updateService } from '../../redux/slices/serviceSlice';
import Loader from '../../components/common/Loader';

const ProviderServices = () => {
  const dispatch = useDispatch();
  const { myServices, loading } = useSelector((state) => state.services);

  useEffect(() => {
    dispatch(fetchMyServices());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      const result = await dispatch(deleteService(id));
      if (deleteService.fulfilled.match(result)) {
        toast.success('Service deleted successfully');
      } else {
        toast.error(result.payload || 'Failed to delete service');
      }
    }
  };

  const handleToggleActive = async (service) => {
    const result = await dispatch(updateService({
      id: service._id,
      serviceData: { ...service, isActive: !service.isActive }
    }));
    if (updateService.fulfilled.match(result)) {
      toast.success(`Service ${!service.isActive ? 'activated' : 'deactivated'}`);
      dispatch(fetchMyServices());
    } else {
      toast.error(result.payload || 'Failed to update service');
    }
  };

  const categoryIcons = {
    'web-development': '🌐',
    'mobile-development': '📱',
    'ui-ux-design': '🎨',
    'cloud-services': '☁️',
    'data-analytics': '📊',
    'cybersecurity': '🔒',
    'ai-ml': '🤖',
    'consulting': '💼',
    'maintenance': '🔧',
    'other': '📦',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Services</h1>
          <p className="text-dark-400">Manage your services and offerings</p>
        </div>
        <Link to="/provider/services/new" className="btn-primary">
          <FiPlus />
          Add New Service
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader size="lg" text="Loading services..." />
        </div>
      ) : myServices.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Services Yet</h3>
          <p className="text-dark-400 mb-6">Start adding services to receive bookings</p>
          <Link to="/provider/services/new" className="btn-primary">
            <FiPlus />
            Add Your First Service
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {myServices.map((service) => (
            <div key={service._id} className="card">
              <div className="flex flex-col sm:flex-row items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-cyber-500/20 to-primary-500/20 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                  {categoryIcons[service.category] || '📦'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-white truncate">{service.title}</h3>
                    <span className={`badge ${service.isActive ? 'badge-completed' : 'badge-cancelled'}`}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-dark-400 text-sm line-clamp-2 mb-3">{service.description}</p>
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center gap-1.5 text-emerald-400">
                      <FiDollarSign className="w-4 h-4" />
                      <span>${service.price}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-dark-400">
                      <FiClock className="w-4 h-4" />
                      <span>{service.duration} min</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleToggleActive(service)}
                    className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                    title={service.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {service.isActive ? (
                      <FiToggleRight className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <FiToggleLeft className="w-6 h-6 text-dark-400" />
                    )}
                  </button>
                  <Link
                    to={`/provider/services/${service._id}/edit`}
                    className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                  >
                    <FiEdit2 className="w-5 h-5 text-blue-400" />
                  </Link>
                  <button
                    onClick={() => handleDelete(service._id)}
                    className="p-2 hover:bg-dark-700 rounded-lg transition-colors"
                  >
                    <FiTrash2 className="w-5 h-5 text-red-400" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderServices;
