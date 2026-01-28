import api from './api';

const bookingService = {
    createBooking: async (bookingData) => {
        const response = await api.post('/bookings', bookingData);
        return response.data;
    },

    getMyBookings: async (params = {}) => {
        const response = await api.get('/bookings/my-bookings', { params });
        return response.data;
    },

    getProviderBookings: async (params = {}) => {
        const response = await api.get('/bookings/provider-bookings', { params });
        return response.data;
    },

    getBookingById: async (id) => {
        const response = await api.get(`/bookings/${id}`);
        return response.data;
    },

    updateBookingStatus: async (id, status) => {
        const response = await api.put(`/bookings/${id}/status`, { status });
        return response.data;
    },

    cancelBooking: async (id) => {
        const response = await api.put(`/bookings/${id}/cancel`);
        return response.data;
    },

    getAllBookings: async (params = {}) => {
        const response = await api.get('/bookings/all', { params });
        return response.data;
    },
};

export default bookingService;
