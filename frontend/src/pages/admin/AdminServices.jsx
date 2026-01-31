import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiSearch, FiDollarSign, FiClock, FiUser, FiDatabase, FiTrash2 } from 'react-icons/fi';
import { fetchAdminServices } from '../../redux/slices/adminSlice';
import adminService from '../../services/adminService';
import Loader from '../../components/common/Loader';

const AdminServices = () => {
  const [search, setSearch] = useState('');
  const [seeding, setSeeding] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const dispatch = useDispatch();
  const { services, loading, pagination } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminServices());
  }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchAdminServices({ search }));
  };

  const handleSeedServices = async () => {
    if (!window.confirm('This will add sample services to the database. Continue?')) return;
    
    setSeeding(true);
    setMessage({ type: '', text: '' });
    try {
      const result = await adminService.seedServices();
      setMessage({ type: 'success', text: result.message });
      dispatch(fetchAdminServices());
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to seed services' });
    } finally {
      setSeeding(false);
    }
  };

  const handleClearServices = async () => {
    if (!window.confirm('This will DELETE ALL services from the database. Are you sure?')) return;
    
    setClearing(true);
    setMessage({ type: '', text: '' });
    try {
      const result = await adminService.clearServices();
      setMessage({ type: 'success', text: result.message });
      dispatch(fetchAdminServices());
    } catch (error) {
      setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to clear services' });
    } finally {
      setClearing(false);
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
          <h1 className="text-2xl font-bold text-white">All Services</h1>
          <p className="text-dark-400">View all services on the platform</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleSeedServices}
            disabled={seeding || clearing}
            className="btn-primary flex items-center gap-2"
          >
            <FiDatabase className="w-4 h-4" />
            {seeding ? 'Seeding...' : 'Seed Sample Services'}
          </button>
          <button
            onClick={handleClearServices}
            disabled={seeding || clearing || services.length === 0}
            className="btn-outline border-red-500 text-red-400 hover:bg-red-500/10 flex items-center gap-2"
          >
            <FiTrash2 className="w-4 h-4" />
            {clearing ? 'Clearing...' : 'Clear All'}
          </button>
        </div>
      </div>

      {/* Status Message */}
      {message.text && (
        <div className={`p-4 rounded-lg ${message.type === 'success' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
          {message.text}
        </div>
      )}

      {/* Search */}
      <form onSubmit={handleSearch} className="flex gap-4">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services..."
            className="input pl-11"
          />
        </div>
        <button type="submit" className="btn-primary">
          Search
        </button>
      </form>

      {/* Services Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader size="lg" text="Loading services..." />
        </div>
      ) : services.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Services Found</h3>
          <p className="text-dark-400">There are no services on the platform yet.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {services.map((service) => (
            <div key={service._id} className="card">
              <div className="flex items-start gap-4">
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
                    <div className="flex items-center gap-1.5 text-dark-400">
                      <FiUser className="w-4 h-4" />
                      <span>{service.providerId?.name || 'Unknown'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminServices;
