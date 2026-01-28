import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FiCalendar, FiClock, FiDollarSign, FiUser, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { fetchMyBookings, cancelBooking } from '../../redux/slices/bookingSlice';
import Loader from '../../components/common/Loader';

const CustomerBookings = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchMyBookings({ status: statusFilter }));
  }, [dispatch, statusFilter]);

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      const result = await dispatch(cancelBooking(id));
      if (cancelBooking.fulfilled.match(result)) {
        toast.success('Booking cancelled successfully');
      } else {
        toast.error(result.payload || 'Failed to cancel booking');
      }
    }
  };

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
      <div>
        <h1 className="text-2xl font-bold text-white">My Bookings</h1>
        <p className="text-dark-400">View and manage your service bookings</p>
      </div>

      {/* Status Filter */}
      <div className="flex gap-2 flex-wrap">
        {['', 'pending', 'confirmed', 'in-progress', 'completed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              statusFilter === status
                ? 'bg-cyber-500 text-white'
                : 'bg-dark-800 text-dark-300 hover:bg-dark-700'
            }`}
          >
            {status ? status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ') : 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader size="lg" text="Loading bookings..." />
        </div>
      ) : bookings.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Bookings Found</h3>
          <p className="text-dark-400 mb-6">
            {statusFilter ? 'No bookings with this status.' : 'You haven\'t made any bookings yet.'}
          </p>
          <Link to="/services" className="btn-primary">
            Browse Services
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="card">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-cyber-500/20 to-primary-500/20 rounded-xl flex items-center justify-center text-3xl flex-shrink-0">
                  {categoryIcons[booking.serviceId?.category] || '📦'}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-white">{booking.serviceId?.title}</h3>
                    <span className={`badge ${statusColors[booking.status]}`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-dark-400">
                      <FiUser className="w-4 h-4" />
                      <span>{booking.providerId?.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-dark-400">
                      <FiCalendar className="w-4 h-4" />
                      <span>{new Date(booking.date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-dark-400">
                      <FiClock className="w-4 h-4" />
                      <span>{booking.timeSlot}</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <FiDollarSign className="w-4 h-4" />
                      <span>${booking.totalPrice}</span>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="mt-3 p-3 bg-dark-800/50 rounded-lg">
                      <p className="text-dark-400 text-xs mb-1">Notes</p>
                      <p className="text-dark-200 text-sm">{booking.notes}</p>
                    </div>
                  )}
                </div>

                {/* Cancel Button */}
                {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                  <button
                    onClick={() => handleCancel(booking._id)}
                    className="btn-danger btn-sm"
                  >
                    <FiX />
                    Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomerBookings;
