import axios from 'axios';

// Use environment variable for API URL
// In production, VITE_API_URL must be set to the backend Vercel URL
// In development, the Vite proxy handles /api requests
const API_URL = import.meta.env.VITE_API_URL ||
    (import.meta.env.PROD ? 'https://itsolera-task-2.vercel.app/api' : '/api');

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
