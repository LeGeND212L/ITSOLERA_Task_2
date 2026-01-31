import api from './api';

const adminService = {
    getDashboardStats: async () => {
        const response = await api.get('/admin/dashboard');
        return response.data;
    },

    getAllUsers: async (params = {}) => {
        const response = await api.get('/admin/users', { params });
        return response.data;
    },

    deleteUser: async (id) => {
        const response = await api.delete(`/admin/users/${id}`);
        return response.data;
    },

    getPendingProviders: async (params = {}) => {
        const response = await api.get('/admin/providers/pending', { params });
        return response.data;
    },

    approveProvider: async (id) => {
        const response = await api.put(`/admin/providers/${id}/approve`);
        return response.data;
    },

    rejectProvider: async (id) => {
        const response = await api.put(`/admin/providers/${id}/reject`);
        return response.data;
    },

    getAdminServices: async (params = {}) => {
        const response = await api.get('/admin/services', { params });
        return response.data;
    },

    getAdminBookings: async (params = {}) => {
        const response = await api.get('/admin/bookings', { params });
        return response.data;
    },

    seedServices: async () => {
        const response = await api.post('/admin/seed-services');
        return response.data;
    },

    clearServices: async () => {
        const response = await api.delete('/admin/clear-services');
        return response.data;
    },
};

export default adminService;
