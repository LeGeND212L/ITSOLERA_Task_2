import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  FiPackage,
  FiCalendar,
  FiDollarSign,
  FiTrendingUp,
  FiClock,
  FiPlus,
  FiAlertCircle,
} from 'react-icons/fi';
import { fetchMyServices } from '../../redux/slices/serviceSlice';
import { fetchProviderBookings } from '../../redux/slices/bookingSlice';
import Loader from '../../components/common/Loader';

const ProviderDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { myServices, loading: servicesLoading } = useSelector((state) => state.services);
  const { bookings, loading: bookingsLoading } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchMyServices());
    dispatch(fetchProviderBookings());
  }, [dispatch]);

  const loading = servicesLoading || bookingsLoading;

  // Calculate stats
  const totalServices = myServices.length;
  const activeServices = myServices.filter(s => s.isActive).length;
  const totalBookings = bookings.length;
  const pendingBookings = bookings.filter(b => b.status === 'pending').length;
  const completedBookings = bookings.filter(b => b.status === 'completed').length;
  const totalEarnings = bookings
    .filter(b => b.status === 'completed')
    .reduce((sum, b) => sum + b.totalPrice, 0);

  const statusColors = {
    pending: 'badge-pending',
    confirmed: 'badge-confirmed',
    'in-progress': 'badge-in-progress',
    completed: 'badge-completed',
    cancelled: 'badge-cancelled',
  };

  if (!user?.isApproved) {
    return (
      <div className="card text-center py-16 max-w-lg mx-auto">
        <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiAlertCircle className="w-8 h-8 text-yellow-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Account Pending Approval</h2>
        <p className="text-dark-400 mb-6">
          Your service provider account is currently under review. You'll be notified once an admin approves your account.
        </p>
        <Link to="/" className="btn-secondary">
          Return Home
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Provider Dashboard</h1>
          <p className="text-dark-400">Welcome back, {user?.name}</p>
        </div>
        <Link to="/provider/services/new" className="btn-primary">
          <FiPlus />
          Add New Service
        </Link>
      </div>

      {loading && !myServices.length ? (
        <div className="flex justify-center py-12">
          <Loader size="lg" text="Loading dashboard..." />
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-dark-400 text-sm mb-1">My Services</p>
                  <p className="text-3xl font-bold text-white">{totalServices}</p>
                  <p className="text-dark-400 text-xs mt-1">{activeServices} active</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <FiPackage className="w-6 h-6 text-purple-400" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-dark-400 text-sm mb-1">Total Bookings</p>
                  <p className="text-3xl font-bold text-white">{totalBookings}</p>
                  <p className="text-dark-400 text-xs mt-1">{pendingBookings} pending</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                  <FiCalendar className="w-6 h-6 text-blue-400" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-dark-400 text-sm mb-1">Completed</p>
                  <p className="text-3xl font-bold text-white">{completedBookings}</p>
                  <p className="text-dark-400 text-xs mt-1">all time</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                  <FiTrendingUp className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-dark-400 text-sm mb-1">Earnings</p>
                  <p className="text-3xl font-bold text-white">${totalEarnings}</p>
                  <p className="text-dark-400 text-xs mt-1">from completed</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <FiDollarSign className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Pending Bookings Alert */}
          {pendingBookings > 0 && (
            <div className="card bg-yellow-500/10 border-yellow-500/30">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                  <FiClock className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-medium">Pending Bookings</h3>
                  <p className="text-dark-300 text-sm">
                    You have {pendingBookings} booking(s) waiting for confirmation
                  </p>
                </div>
                <Link to="/provider/bookings" className="btn-primary btn-sm">
                  View Bookings
                </Link>
              </div>
            </div>
          )}

          {/* Recent Bookings */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Recent Bookings</h2>
              <Link to="/provider/bookings" className="link text-sm">View All</Link>
            </div>

            {bookings.length === 0 ? (
              <div className="text-center py-8 text-dark-400">
                No bookings yet. Share your services to get started!
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 5).map((booking) => (
                  <div key={booking._id} className="flex items-center gap-4 p-4 bg-dark-800/50 rounded-lg">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium truncate">{booking.serviceId?.title}</h4>
                      <p className="text-dark-400 text-sm">
                        {booking.customerId?.name} • {new Date(booking.date).toLocaleDateString()} at {booking.timeSlot}
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
        </>
      )}
    </div>
  );
};

export default ProviderDashboard;
