import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import { FiMenu, FiX, FiUser, FiLogOut, FiGrid, FiSettings } from 'react-icons/fi';
import { logout } from '../../redux/slices/authSlice';
import logo from '../../assets/logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setShowDropdown(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'provider':
        return '/provider/dashboard';
      default:
        return '/customer/dashboard';
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <img 
              src={logo} 
              alt="Apex Booking" 
              className="w-10 h-10 rounded-lg transition-transform group-hover:scale-110" 
            />
            <span className="text-xl font-bold gradient-text hidden sm:block group-hover:text-cyber-400 transition-colors">Apex Booking</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-dark-200 hover:text-cyber-400 transition-colors font-medium">
              Home
            </Link>
            <Link to="/services" className="text-dark-200 hover:text-cyber-400 transition-colors font-medium">
              Services
            </Link>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-dark-700 hover:bg-dark-600 transition-all hover:scale-105"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-cyber-500 to-primary-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user?.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-dark-200">{user?.name}</span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-dark-800 border border-dark-600 rounded-xl shadow-xl animate-slide-down overflow-hidden">
                    <div className="px-4 py-3 border-b border-dark-600">
                      <p className="text-sm text-dark-400">Signed in as</p>
                      <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 bg-cyber-500/20 text-cyber-400 text-xs rounded-full capitalize">
                        {user?.role}
                      </span>
                    </div>
                    <div className="py-2">
                      <Link
                        to={getDashboardLink()}
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-dark-200 hover:text-white hover:bg-dark-700 transition-all hover:translate-x-1"
                      >
                        <FiGrid className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-dark-200 hover:text-white hover:bg-dark-700 transition-all hover:translate-x-1"
                      >
                        <FiSettings className="w-4 h-4" />
                        Settings
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:text-red-300 hover:bg-dark-700 transition-all hover:translate-x-1"
                      >
                        <FiLogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="btn-secondary btn-sm hover:scale-105 transition-transform">
                  Login
                </Link>
                <Link to="/register" className="btn-primary btn-sm hover:scale-105 transition-transform">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-dark-200 hover:text-white"
          >
            {isOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-dark-800 border-t border-dark-700 animate-slide-down">
          <div className="px-4 py-4 space-y-3">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className="block text-dark-200 hover:text-white py-2"
            >
              Home
            </Link>
            <Link
              to="/services"
              onClick={() => setIsOpen(false)}
              className="block text-dark-200 hover:text-white py-2"
            >
              Services
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to={getDashboardLink()}
                  onClick={() => setIsOpen(false)}
                  className="block text-dark-200 hover:text-white py-2"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="block text-red-400 hover:text-red-300 py-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="btn-secondary text-center"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="btn-primary text-center"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
