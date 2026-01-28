import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { fetchProviderBookings, updateBookingStatus } from '../../redux/slices/bookingSlice';
import Loader from '../../components/common/Loader';

const ProviderBookings = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(fetchProviderBookings({ status: statusFilter }));
  }, [dispatch, statusFilter]);

  const handleStatusChange = async (id, status) => {
    const result = await dispatch(updateBookingStatus({ id, status }));
    if (updateBookingStatus.fulfilled.match(result)) {
      toast.success('Booking status updated');
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

  const getNextStatus = (currentStatus) => {
    const flow = {
      pending: 'confirmed',
      confirmed: 'in-progress',
      'in-progress': 'completed',
    };
    return flow[currentStatus];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Manage Bookings</h1>
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
          <p className="text-dark-400">
            {statusFilter ? 'No bookings with this status.' : 'You haven\'t received any bookings yet.'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="card">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold text-white">{booking.serviceId?.title}</h3>
                    <span className={`badge ${statusColors[booking.status]}`}>
                      {booking.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-dark-400">Customer</p>
                      <p className="text-white">{booking.customerId?.name}</p>
                      <p className="text-dark-400">{booking.customerId?.email}</p>
                    </div>
                    <div>
                      <p className="text-dark-400">Date & Time</p>
                      <p className="text-white">
                        {new Date(booking.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                      <p className="text-dark-400">{booking.timeSlot}</p>
                    </div>
                    <div>
                      <p className="text-dark-400">Amount</p>
                      <p className="text-emerald-400 font-semibold">${booking.totalPrice}</p>
                    </div>
                  </div>

                  {booking.notes && (
                    <div className="mt-3 p-3 bg-dark-800/50 rounded-lg">
                      <p className="text-dark-400 text-xs mb-1">Notes</p>
                      <p className="text-dark-200 text-sm">{booking.notes}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                  <div className="flex flex-col gap-2 lg:w-40">
                    {getNextStatus(booking.status) && (
                      <button
                        onClick={() => handleStatusChange(booking._id, getNextStatus(booking.status))}
                        className="btn-success btn-sm"
                      >
                        Mark as {getNextStatus(booking.status).replace('-', ' ')}
                      </button>
                    )}
                    <button
                      onClick={() => handleStatusChange(booking._id, 'cancelled')}
                      className="btn-danger btn-sm"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderBookings;
