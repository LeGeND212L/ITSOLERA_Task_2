import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import adminService from '../../services/adminService';

const initialState = {
    stats: null,
    users: [],
    pendingProviders: [],
    services: [],
    bookings: [],
    pagination: null,
    loading: false,
    error: null,
};

export const fetchDashboardStats = createAsyncThunk(
    'admin/fetchDashboardStats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await adminService.getDashboardStats();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
        }
    }
);

export const fetchAllUsers = createAsyncThunk(
    'admin/fetchAllUsers',
    async (params, { rejectWithValue }) => {
        try {
            const response = await adminService.getAllUsers(params);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
        }
    }
);

export const deleteUser = createAsyncThunk(
    'admin/deleteUser',
    async (id, { rejectWithValue }) => {
        try {
            await adminService.deleteUser(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete user');
        }
    }
);

export const fetchPendingProviders = createAsyncThunk(
    'admin/fetchPendingProviders',
    async (params, { rejectWithValue }) => {
        try {
            const response = await adminService.getPendingProviders(params);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch providers');
        }
    }
);

export const approveProvider = createAsyncThunk(
    'admin/approveProvider',
    async (id, { rejectWithValue }) => {
        try {
            const response = await adminService.approveProvider(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to approve provider');
        }
    }
);

export const rejectProvider = createAsyncThunk(
    'admin/rejectProvider',
    async (id, { rejectWithValue }) => {
        try {
            await adminService.rejectProvider(id);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to reject provider');
        }
    }
);

export const fetchAdminServices = createAsyncThunk(
    'admin/fetchAdminServices',
    async (params, { rejectWithValue }) => {
        try {
            const response = await adminService.getAdminServices(params);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch services');
        }
    }
);

export const fetchAdminBookings = createAsyncThunk(
    'admin/fetchAdminBookings',
    async (params, { rejectWithValue }) => {
        try {
            const response = await adminService.getAdminBookings(params);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
        }
    }
);

const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.loading = false;
                state.stats = action.payload.data;
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAllUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload.data.users;
                state.pagination = action.payload.data.pagination;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(u => u._id !== action.payload);
            })
            .addCase(fetchPendingProviders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPendingProviders.fulfilled, (state, action) => {
                state.loading = false;
                state.pendingProviders = action.payload.data.providers;
                state.pagination = action.payload.data.pagination;
            })
            .addCase(fetchPendingProviders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(approveProvider.fulfilled, (state, action) => {
                state.pendingProviders = state.pendingProviders.filter(
                    p => p._id !== action.payload.data.user._id
                );
            })
            .addCase(rejectProvider.fulfilled, (state, action) => {
                state.pendingProviders = state.pendingProviders.filter(p => p._id !== action.payload);
            })
            .addCase(fetchAdminServices.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminServices.fulfilled, (state, action) => {
                state.loading = false;
                state.services = action.payload.data.services;
                state.pagination = action.payload.data.pagination;
            })
            .addCase(fetchAdminServices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchAdminBookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings = action.payload.data.bookings;
                state.pagination = action.payload.data.pagination;
            })
            .addCase(fetchAdminBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
