import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

// Redux
import { getMe } from './redux/slices/authSlice';

// Components
import Loader from './components/common/Loader';
import ProtectedRoute from './components/common/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';
import DashboardLayout from './components/layout/DashboardLayout';

// Public Pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Services from './pages/services/Services';
import ServiceDetail from './pages/services/ServiceDetail';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminProviders from './pages/admin/AdminProviders';
import AdminServices from './pages/admin/AdminServices';
import AdminBookings from './pages/admin/AdminBookings';

// Provider Pages
import ProviderDashboard from './pages/provider/ProviderDashboard';
import ProviderServices from './pages/provider/ProviderServices';
import ServiceForm from './pages/provider/ServiceForm';
import ProviderBookings from './pages/provider/ProviderBookings';

// Customer Pages
import CustomerDashboard from './pages/customer/CustomerDashboard';
import CustomerBookings from './pages/customer/CustomerBookings';

// Common Pages
import Profile from './pages/Profile';
import Settings from './pages/Settings';

function App() {
  const dispatch = useDispatch();
  const { user, loading, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Check if token exists and fetch user data
    const token = localStorage.getItem('token');
    if (token && !user) {
      dispatch(getMe());
    }
  }, [dispatch, user]);

  // Show loader while checking auth
  if (loading && !user) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <Loader size="xl" />
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Routes with MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/services" element={<Services />} />
        <Route path="/services/:id" element={<ServiceDetail />} />
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={getDashboardRoute(user?.role)} replace />
            ) : (
              <Login />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to={getDashboardRoute(user?.role)} replace />
            ) : (
              <Register />
            )
          }
        />
      </Route>

        {/* Admin Routes */}
        <Route
          element={
            <ProtectedRoute roles={['admin']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/providers" element={<AdminProviders />} />
          <Route path="/admin/services" element={<AdminServices />} />
          <Route path="/admin/bookings" element={<AdminBookings />} />
          <Route path="/admin/profile" element={<Profile />} />
          <Route path="/admin/settings" element={<Settings />} />
        </Route>

        {/* Provider Routes */}
        <Route
          element={
            <ProtectedRoute roles={['provider']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/provider/dashboard" element={<ProviderDashboard />} />
          <Route path="/provider/services" element={<ProviderServices />} />
          <Route path="/provider/services/new" element={<ServiceForm />} />
          <Route path="/provider/services/:id/edit" element={<ServiceForm />} />
          <Route path="/provider/bookings" element={<ProviderBookings />} />
          <Route path="/provider/profile" element={<Profile />} />
          <Route path="/provider/settings" element={<Settings />} />
        </Route>

        {/* Customer Routes */}
        <Route
          element={
            <ProtectedRoute roles={['customer']}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/customer/bookings" element={<CustomerBookings />} />
          <Route path="/customer/settings" element={<Settings />} />
          <Route path="/customer/profile" element={<Profile />} />
        </Route>

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

  );
}

// Helper function to get dashboard route based on role
function getDashboardRoute(role) {
  switch (role) {
    case 'admin':
      return '/admin/dashboard';
    case 'provider':
      return '/provider/dashboard';
    case 'customer':
      return '/customer/dashboard';
    default:
      return '/';
  }
}

export default App;
