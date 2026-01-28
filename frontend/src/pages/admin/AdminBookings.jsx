import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminBookings } from '../../redux/slices/adminSlice';
import { updateBookingStatus } from '../../redux/slices/bookingSlice';
import toast from 'react-hot-toast';
import Loader from '../../components/common/Loader';

const AdminBookings = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const dispatch = useDispatch();
  const { bookings, loading, pagination } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminBookings({ status: statusFilter }));
  }, [dispatch, statusFilter]);

  const handleStatusChange = async (id, status) => {
    const result = await dispatch(updateBookingStatus({ id, status }));
    if (updateBookingStatus.fulfilled.match(result)) {
      toast.success('Booking status updated');
      dispatch(fetchAdminBookings({ status: statusFilter }));
    } else {
      toast.error(result.payload || 'Failed to update status');
    }
  };

  const statusColors = {
    pending: 'badge-pending',
    confirmed: 'badge-confirmed',
    'in-progress': 'badge-in-progress',
    completed: 'badge-completed',
    cancelled: 'badge-cancelled',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">All Bookings</h1>
        <p className="text-dark-400">View and manage all bookings on the platform</p>
      </div>

      {/* Filter */}
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

      {/* Bookings */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader size="lg" text="Loading bookings..." />
        </div>
      ) : bookings.length === 0 ? (
        <div className="card text-center py-16">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-semibold text-white mb-2">No Bookings Found</h3>
          <p className="text-dark-400">There are no bookings matching your criteria.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700">
                  <th className="text-left py-3 px-4 text-dark-400 font-medium text-sm">Service</th>
                  <th className="text-left py-3 px-4 text-dark-400 font-medium text-sm">Customer</th>
                  <th className="text-left py-3 px-4 text-dark-400 font-medium text-sm">Provider</th>
                  <th className="text-left py-3 px-4 text-dark-400 font-medium text-sm">Date</th>
                  <th className="text-left py-3 px-4 text-dark-400 font-medium text-sm">Amount</th>
                  <th className="text-left py-3 px-4 text-dark-400 font-medium text-sm">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} className="border-b border-dark-800 hover:bg-dark-800/50">
                    <td className="py-3 px-4 text-white">{booking.serviceId?.title || 'N/A'}</td>
                    <td className="py-3 px-4 text-dark-300">{booking.customerId?.name || 'N/A'}</td>
                    <td className="py-3 px-4 text-dark-300">{booking.providerId?.name || 'N/A'}</td>
                    <td className="py-3 px-4 text-dark-300">
                      {new Date(booking.date).toLocaleDateString()} - {booking.timeSlot}
                    </td>
                    <td className="py-3 px-4 text-emerald-400">${booking.totalPrice}</td>
                    <td className="py-3 px-4">
                      <select
                        value={booking.status}
                        onChange={(e) => handleStatusChange(booking._id, e.target.value)}
                        className="bg-dark-800 border border-dark-600 rounded-lg px-2 py-1 text-sm text-dark-200 focus:outline-none focus:border-cyber-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
