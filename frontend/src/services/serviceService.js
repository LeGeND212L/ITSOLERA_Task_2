import api from './api';

const serviceService = {
    getServices: async (params = {}) => {
        const response = await api.get('/services', { params });
        return response.data;
    },

    getServiceById: async (id) => {
        const response = await api.get(`/services/${id}`);
        return response.data;
    },

    getCategories: async () => {
        const response = await api.get('/services/categories');
        return response.data.data?.categories || response.data.categories || response.data;
    },

    createService: async (serviceData) => {
        const response = await api.post('/services', serviceData);
        return response.data;
    },

    updateService: async (id, serviceData) => {
        const response = await api.put(`/services/${id}`, serviceData);
        return response.data;
    },

    deleteService: async (id) => {
        const response = await api.delete(`/services/${id}`);
        return response.data;
    },

    getMyServices: async (params = {}) => {
        const response = await api.get('/services/provider/my-services', { params });
        return response.data;
    },
};

export default serviceService;
