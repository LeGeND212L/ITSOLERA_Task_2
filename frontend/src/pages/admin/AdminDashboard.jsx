import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  FiUsers,
  FiPackage,
  FiCalendar,
  FiDollarSign,
  FiTrendingUp,
  FiClock,
  FiUserCheck,
  FiAlertCircle,
} from 'react-icons/fi';
import { fetchDashboardStats } from '../../redux/slices/adminSlice';
import Loader from '../../components/common/Loader';

const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
  <div className="card">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-dark-400 text-sm mb-1">{title}</p>
        <p className="text-3xl font-bold text-white">{value}</p>
        {subtitle && <p className="text-dark-400 text-xs mt-1">{subtitle}</p>}
      </div>
      <div className={`w-12 h-12 rounded-xl bg-${color}-500/20 flex items-center justify-center`}>
        <Icon className={`w-6 h-6 text-${color}-400`} />
      </div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  const statusColors = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    confirmed: 'bg-blue-500/20 text-blue-400',
    'in-progress': 'bg-purple-500/20 text-purple-400',
    completed: 'bg-emerald-500/20 text-emerald-400',
    cancelled: 'bg-red-500/20 text-red-400',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-dark-400">Monitor and manage the entire platform</p>
      </div>

      {/* Pending Providers Alert */}
      {stats?.users?.pendingProviders > 0 && (
        <div className="card bg-yellow-500/10 border-yellow-500/30">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <FiAlertCircle className="w-6 h-6 text-yellow-400" />
            </div>
            <div className="flex-1">
              <h3 className="text-white font-medium">Pending Approvals</h3>
              <p className="text-dark-300 text-sm">
                {stats.users.pendingProviders} service provider(s) waiting for approval
              </p>
            </div>
            <Link to="/admin/providers" className="btn-primary btn-sm">
              Review Now
            </Link>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-dark-400 text-sm mb-1">Total Users</p>
              <p className="text-3xl font-bold text-white">{stats?.users?.total || 0}</p>
              <p className="text-dark-400 text-xs mt-1">
                {stats?.users?.customers || 0} customers, {stats?.users?.providers || 0} providers
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
              <FiUsers className="w-6 h-6 text-cyan-400" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-dark-400 text-sm mb-1">Services</p>
              <p className="text-3xl font-bold text-white">{stats?.services?.total || 0}</p>
              <p className="text-dark-400 text-xs mt-1">
                {stats?.services?.active || 0} active
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
              <FiPackage className="w-6 h-6 text-purple-400" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-dark-400 text-sm mb-1">Bookings</p>
              <p className="text-3xl font-bold text-white">{stats?.bookings?.total || 0}</p>
              <p className="text-dark-400 text-xs mt-1">
                {stats?.bookings?.pending || 0} pending
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <FiCalendar className="w-6 h-6 text-blue-400" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-dark-400 text-sm mb-1">Revenue</p>
              <p className="text-3xl font-bold text-white">${stats?.revenue || 0}</p>
              <p className="text-dark-400 text-xs mt-1">
                {stats?.bookings?.completed || 0} completed
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <FiDollarSign className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Recent Bookings */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-white">Recent Bookings</h2>
          <Link to="/admin/bookings" className="link text-sm">
            View All
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="text-left py-3 px-4 text-dark-400 font-medium text-sm">Service</th>
                <th className="text-left py-3 px-4 text-dark-400 font-medium text-sm">Customer</th>
                <th className="text-left py-3 px-4 text-dark-400 font-medium text-sm">Provider</th>
                <th className="text-left py-3 px-4 text-dark-400 font-medium text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentBookings?.map((booking) => (
                <tr key={booking._id} className="border-b border-dark-800 hover:bg-dark-800/50">
                  <td className="py-3 px-4 text-white">{booking.serviceId?.title || 'N/A'}</td>
                  <td className="py-3 px-4 text-dark-300">{booking.customerId?.name || 'N/A'}</td>
                  <td className="py-3 px-4 text-dark-300">{booking.providerId?.name || 'N/A'}</td>
                  <td className="py-3 px-4">
                    <span className={`badge ${statusColors[booking.status]}`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
              {(!stats?.recentBookings || stats.recentBookings.length === 0) && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-dark-400">
                    No recent bookings
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link to="/admin/users" className="card-hover">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-cyan-500/20 rounded-xl flex items-center justify-center">
              <FiUsers className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="text-white font-medium">Manage Users</h3>
              <p className="text-dark-400 text-sm">View and manage all users</p>
            </div>
          </div>
        </Link>

        <Link to="/admin/providers" className="card-hover">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <FiUserCheck className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h3 className="text-white font-medium">Provider Approvals</h3>
              <p className="text-dark-400 text-sm">Review pending providers</p>
            </div>
          </div>
        </Link>

        <Link to="/admin/services" className="card-hover">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <FiPackage className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h3 className="text-white font-medium">All Services</h3>
              <p className="text-dark-400 text-sm">Manage platform services</p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
