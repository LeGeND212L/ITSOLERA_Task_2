import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiArrowLeft,
  FiClock,
  FiDollarSign,
  FiUser,
  FiMail,
  FiCalendar,
  FiPhone,
} from 'react-icons/fi';
import toast from 'react-hot-toast';
import { fetchServiceById, clearService } from '../../redux/slices/serviceSlice';
import { createBooking } from '../../redux/slices/bookingSlice';
import Loader from '../../components/common/Loader';

const ServiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { service, loading } = useSelector((state) => state.services);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { loading: bookingLoading } = useSelector((state) => state.bookings);

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: '',
    timeSlot: '',
    notes: '',
  });

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
  ];

  const categoryLabels = {
    'web-development': 'Web Development',
    'mobile-development': 'Mobile Development',
    'ui-ux-design': 'UI/UX Design',
    'cloud-services': 'Cloud Services',
    'data-analytics': 'Data Analytics',
    'cybersecurity': 'Cybersecurity',
    'ai-ml': 'AI & Machine Learning',
    'consulting': 'IT Consulting',
    'maintenance': 'Maintenance & Support',
    'other': 'Other Services',
  };

  useEffect(() => {
    dispatch(fetchServiceById(id));
    return () => {
      dispatch(clearService());
    };
  }, [dispatch, id]);

  const handleBookingChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to book a service');
      navigate('/login');
      return;
    }

    if (user.role !== 'customer') {
      toast.error('Only customers can book services');
      return;
    }

    if (!bookingData.date || !bookingData.timeSlot) {
      toast.error('Please select date and time slot');
      return;
    }

    const result = await dispatch(createBooking({
      serviceId: service._id,
      date: bookingData.date,
      timeSlot: bookingData.timeSlot,
      notes: bookingData.notes,
    }));

    if (createBooking.fulfilled.match(result)) {
      toast.success('Booking created successfully!');
      setShowBookingModal(false);
      navigate('/customer/bookings');
    } else {
      toast.error(result.payload || 'Failed to create booking');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" text="Loading service..." />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-6xl mb-4">🔍</div>
        <h2 className="text-2xl font-bold text-white mb-2">Service Not Found</h2>
        <p className="text-dark-400 mb-6">The service you're looking for doesn't exist.</p>
        <Link to="/services" className="btn-primary">
          Browse Services
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/services"
          className="inline-flex items-center gap-2 text-dark-400 hover:text-white mb-6 transition-colors"
        >
          <FiArrowLeft />
          Back to Services
        </Link>

        {/* Service Details */}
        <div className="card mb-6">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-cyber-500/20 to-primary-500/20 rounded-xl flex items-center justify-center text-3xl">
              {service.category === 'web-development' ? '🌐' :
               service.category === 'mobile-development' ? '📱' :
               service.category === 'ui-ux-design' ? '🎨' :
               service.category === 'cloud-services' ? '☁️' :
               service.category === 'data-analytics' ? '📊' :
               service.category === 'cybersecurity' ? '🔒' :
               service.category === 'ai-ml' ? '🤖' :
               service.category === 'consulting' ? '💼' :
               service.category === 'maintenance' ? '🔧' : '📦'}
            </div>
            <div className="flex-1">
              <span className="inline-block px-3 py-1 bg-cyber-500/20 text-cyber-400 text-xs rounded-full mb-2">
                {categoryLabels[service.category]}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-white">{service.title}</h1>
            </div>
          </div>

          <p className="text-dark-300 mb-6 leading-relaxed">{service.description}</p>

          <div className="flex flex-wrap gap-6 mb-6 pb-6 border-b border-dark-700">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                <FiDollarSign className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-dark-400 text-xs">Price</p>
                <p className="text-white font-semibold">${service.price}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <FiClock className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-dark-400 text-xs">Duration</p>
                <p className="text-white font-semibold">{service.duration} min</p>
              </div>
            </div>
          </div>

          {/* Provider Info */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-cyber-500 to-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold">
                {service.providerId?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="text-dark-400 text-sm">Service Provider</p>
              <p className="text-white font-medium">{service.providerId?.name}</p>
              <p className="text-dark-400 text-sm">{service.providerId?.email}</p>
            </div>
          </div>
        </div>

        {/* Book Button */}
        {(!isAuthenticated || user?.role === 'customer') && (
          <button
            onClick={() => isAuthenticated ? setShowBookingModal(true) : navigate('/login')}
            className="btn-primary btn-lg w-full"
          >
            <FiCalendar />
            Book This Service
          </button>
        )}

        {/* Booking Modal */}
        {showBookingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark-950/80 backdrop-blur-sm">
            <div className="card w-full max-w-md animate-slide-up">
              <h2 className="text-xl font-bold text-white mb-6">Book Service</h2>

              <form onSubmit={handleBookingSubmit} className="space-y-5">
                <div>
                  <label className="label">Select Date</label>
                  <input
                    type="date"
                    name="date"
                    value={bookingData.date}
                    onChange={handleBookingChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="label">Select Time Slot</label>
                  <div className="grid grid-cols-2 gap-2">
                    {timeSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setBookingData({ ...bookingData, timeSlot: slot })}
                        className={`px-4 py-2 rounded-lg border transition-colors ${
                          bookingData.timeSlot === slot
                            ? 'bg-cyber-500 border-cyber-500 text-white'
                            : 'bg-dark-800 border-dark-600 text-dark-300 hover:border-cyber-500'
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="label">Notes (Optional)</label>
                  <textarea
                    name="notes"
                    value={bookingData.notes}
                    onChange={handleBookingChange}
                    rows={3}
                    className="input resize-none"
                    placeholder="Any special requirements..."
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={bookingLoading}
                    className="btn-primary flex-1"
                  >
                    {bookingLoading ? <Loader size="sm" /> : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDetail;
