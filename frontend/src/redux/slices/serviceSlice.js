import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import serviceService from '../../services/serviceService';

const initialState = {
    services: [],
    service: null,
    categories: [],
    myServices: [],
    pagination: null,
    loading: false,
    error: null,
};

export const fetchServices = createAsyncThunk(
    'services/fetchServices',
    async (params, { rejectWithValue }) => {
        try {
            const response = await serviceService.getServices(params);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch services');
        }
    }
);

export const fetchServiceById = createAsyncThunk(
    'services/fetchServiceById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await serviceService.getServiceById(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch service');
        }
    }
);

export const fetchCategories = createAsyncThunk(
    'services/fetchCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await serviceService.getCategories();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch categories');
        }
    }
);

export const createService = createAsyncThunk(
    'services/createService',
    async (serviceData, { rejectWithValue }) => {
        try {
            const response = await serviceService.createService(serviceData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create service');
        }
    }
);

export const updateService = createAsyncThunk(
    'services/updateService',
    async ({ id, serviceData }, { rejectWithValue }) => {
        try {
            const response = await serviceService.updateService(id, serviceData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update service');
        }
    }
);

export const deleteService = createAsyncThunk(
    'services/deleteService',
    async (id, { rejectWithValue }) => {
        try {
            await serviceService.deleteService(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete service');
        }
    }
);

export const fetchMyServices = createAsyncThunk(
    'services/fetchMyServices',
    async (params, { rejectWithValue }) => {
        try {
            const response = await serviceService.getMyServices(params);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch services');
        }
    }
);

const serviceSlice = createSlice({
    name: 'services',
    initialState,
    reducers: {
        clearService: (state) => {
            state.service = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchServices.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchServices.fulfilled, (state, action) => {
                state.loading = false;
                state.services = action.payload.data.services;
                state.pagination = action.payload.data.pagination;
            })
            .addCase(fetchServices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchServiceById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchServiceById.fulfilled, (state, action) => {
                state.loading = false;
                state.service = action.payload.data.service;
            })
            .addCase(fetchServiceById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.categories = action.payload.data.categories;
            })
            .addCase(createService.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createService.fulfilled, (state, action) => {
                state.loading = false;
                state.myServices.unshift(action.payload.data.service);
            })
            .addCase(createService.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateService.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateService.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.myServices.findIndex(s => s._id === action.payload.data.service._id);
                if (index !== -1) {
                    state.myServices[index] = action.payload.data.service;
                }
            })
            .addCase(updateService.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteService.fulfilled, (state, action) => {
                state.myServices = state.myServices.filter(s => s._id !== action.payload);
            })
            .addCase(fetchMyServices.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyServices.fulfilled, (state, action) => {
                state.loading = false;
                state.myServices = action.payload.data.services;
                state.pagination = action.payload.data.pagination;
            })
            .addCase(fetchMyServices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearService, clearError } = serviceSlice.actions;
export default serviceSlice.reducer;
