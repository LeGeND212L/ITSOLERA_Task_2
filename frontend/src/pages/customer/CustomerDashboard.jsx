import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  FiCalendar,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiArrowRight,
  FiPackage,
} from 'react-icons/fi';
import { fetchMyBookings } from '../../redux/slices/bookingSlice';
import Loader from '../../components/common/Loader';

const CustomerDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { bookings, loading } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  // Calculate stats
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled').length;

  const statusColors = {
    pending: 'badge-pending',
    confirmed: 'badge-confirmed',
    'in-progress': 'badge-in-progress',
    completed: 'badge-completed',
    cancelled: 'badge-cancelled',
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
          <h1 className="text-2xl font-bold text-white">Welcome, {user?.name}</h1>
          <p className="text-dark-400">Manage your bookings and discover new services</p>
        </div>
        <Link to="/services" className="btn-primary">
          <FiPackage />
          Browse Services
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-dark-400 text-sm mb-1">Total Bookings</p>
              <p className="text-3xl font-bold text-white">{totalBookings}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <FiCalendar className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-dark-400 text-sm mb-1">Pending</p>
              <p className="text-3xl font-bold text-white">{pendingBookings}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
              <FiClock className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-dark-400 text-sm mb-1">Completed</p>
              <p className="text-3xl font-bold text-white">{completedBookings}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <FiCheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-dark-400 text-sm mb-1">Cancelled</p>
              <p className="text-3xl font-bold text-white">{cancelledBookings}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
              <FiXCircle className="w-6 h-6 text-red-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Recent Bookings</h2>
          <Link to="/customer/bookings" className="link text-sm flex items-center gap-1">
            View All <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <Loader size="md" text="Loading bookings..." />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-lg font-semibold text-white mb-2">No Bookings Yet</h3>
            <p className="text-dark-400 mb-6">Start exploring our services to make your first booking</p>
            <Link to="/services" className="btn-primary">
              Browse Services
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 5).map((booking) => (
              <div key={booking._id} className="flex items-center gap-4 p-4 bg-dark-800/50 rounded-lg">
                <div className="w-12 h-12 bg-gradient-to-br from-cyber-500/20 to-primary-500/20 rounded-xl flex items-center justify-center text-xl">
                  {categoryIcons[booking.serviceId?.category] || '📦'}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium truncate">{booking.serviceId?.title}</h4>
                  <p className="text-dark-400 text-sm">
                    {booking.providerId?.name} • {new Date(booking.date).toLocaleDateString()} at {booking.timeSlot}
                  </p>
                </div>
                <span className={`badge ${statusColors[booking.status]}`}>
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link to="/services" className="card-hover">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-cyber-500/20 rounded-xl flex items-center justify-center">
              <FiPackage className="w-6 h-6 text-cyber-400" />
            </div>
            <div>
              <h3 className="text-white font-medium">Browse Services</h3>
              <p className="text-dark-400 text-sm">Discover new services to book</p>
            </div>
          </div>
        </Link>

        <Link to="/customer/bookings" className="card-hover">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <FiCalendar className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-white font-medium">My Bookings</h3>
              <p className="text-dark-400 text-sm">View and manage your bookings</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default CustomerDashboard;
