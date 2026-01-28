import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import bookingService from '../../services/bookingService';

const initialState = {
    bookings: [],
    booking: null,
    pagination: null,
    loading: false,
    error: null,
};

export const createBooking = createAsyncThunk(
    'bookings/createBooking',
    async (bookingData, { rejectWithValue }) => {
        try {
            const response = await bookingService.createBooking(bookingData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to create booking');
        }
    }
);

export const fetchMyBookings = createAsyncThunk(
    'bookings/fetchMyBookings',
    async (params, { rejectWithValue }) => {
        try {
            const response = await bookingService.getMyBookings(params);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
        }
    }
);

export const fetchProviderBookings = createAsyncThunk(
    'bookings/fetchProviderBookings',
    async (params, { rejectWithValue }) => {
        try {
            const response = await bookingService.getProviderBookings(params);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch bookings');
        }
    }
);

export const fetchBookingById = createAsyncThunk(
    'bookings/fetchBookingById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await bookingService.getBookingById(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch booking');
        }
    }
);

export const updateBookingStatus = createAsyncThunk(
    'bookings/updateBookingStatus',
    async ({ id, status }, { rejectWithValue }) => {
        try {
            const response = await bookingService.updateBookingStatus(id, status);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update booking');
        }
    }
);

export const cancelBooking = createAsyncThunk(
    'bookings/cancelBooking',
    async (id, { rejectWithValue }) => {
        try {
            const response = await bookingService.cancelBooking(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to cancel booking');
        }
    }
);

const bookingSlice = createSlice({
    name: 'bookings',
    initialState,
    reducers: {
        clearBooking: (state) => {
            state.booking = null;
        },
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(createBooking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createBooking.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings.unshift(action.payload.data.booking);
            })
            .addCase(createBooking.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchMyBookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings = action.payload.data.bookings;
                state.pagination = action.payload.data.pagination;
            })
            .addCase(fetchMyBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchProviderBookings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProviderBookings.fulfilled, (state, action) => {
                state.loading = false;
                state.bookings = action.payload.data.bookings;
                state.pagination = action.payload.data.pagination;
            })
            .addCase(fetchProviderBookings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchBookingById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBookingById.fulfilled, (state, action) => {
                state.loading = false;
                state.booking = action.payload.data.booking;
            })
            .addCase(fetchBookingById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updateBookingStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateBookingStatus.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.bookings.findIndex(b => b._id === action.payload.data.booking._id);
                if (index !== -1) {
                    state.bookings[index] = action.payload.data.booking;
                }
            })
            .addCase(updateBookingStatus.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(cancelBooking.pending, (state) => {
                state.loading = true;
            })
            .addCase(cancelBooking.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.bookings.findIndex(b => b._id === action.payload.data.booking._id);
                if (index !== -1) {
                    state.bookings[index] = action.payload.data.booking;
                }
            })
            .addCase(cancelBooking.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearBooking, clearError } = bookingSlice.actions;
export default bookingSlice.reducer;
