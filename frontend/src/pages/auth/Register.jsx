import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { FiUser, FiMail, FiLock, FiArrowRight, FiPhone, FiCheck, FiX, FiEye, FiEyeOff } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { register, clearError } from '../../redux/slices/authSlice';
import Loader from '../../components/common/Loader';
import logo from '../../assets/logo.png';

const Register = () => {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get('role');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: roleParam === 'provider' ? 'provider' : 'customer',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'provider' && !user.isApproved) {
        toast.success('Registration successful! Awaiting admin approval.');
        navigate('/login');
      } else {
        const redirectPath = user.role === 'admin'
          ? '/admin/dashboard'
          : user.role === 'provider'
            ? '/provider/dashboard'
            : '/customer/dashboard';
        navigate(redirectPath, { replace: true });
      }
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        else if (value.trim().length < 2) error = 'Name must be at least 2 characters';
        break;
      
      case 'email':
        if (!value.trim()) error = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = 'Invalid email format';
        break;
      
      case 'phone':
        if (value && !/^\d+$/.test(value)) error = 'Phone must contain only numbers';
        else if (value && value.length > 11) error = 'Phone must not exceed 11 digits';
        break;
      
      case 'password':
        if (!value) error = 'Password is required';
        else if (value.length < 6) error = 'Password must be at least 6 characters';
        else if (!/(?=.*[a-z])/.test(value)) error = 'Password must contain lowercase letter';
        else if (!/(?=.*[A-Z])/.test(value)) error = 'Password must contain uppercase letter';
        else if (!/(?=.*\d)/.test(value)) error = 'Password must contain a number';
        break;
      
      case 'confirmPassword':
        if (!value) error = 'Please confirm your password';
        else if (value !== formData.password) error = 'Passwords do not match';
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Limit phone to 11 digits
    if (name === 'phone' && value.length > 11) {
      return;
    }

    setFormData({ ...formData, [name]: value });
    
    // Real-time validation
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors({ ...errors, [name]: error });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    const error = validateField(name, value);
    setErrors({ ...errors, [name]: error });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (key !== 'confirmPassword' && key !== 'role') {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    // Validate confirm password
    const confirmError = validateField('confirmPassword', formData.confirmPassword);
    if (confirmError) newErrors.confirmPassword = confirmError;

    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      password: true,
      confirmPassword: true,
      phone: true,
    });

    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fix all validation errors');
      return;
    }

    const { confirmPassword, ...submitData } = formData;
    await dispatch(register(submitData));
  };

  const getPasswordStrength = () => {
    const pwd = formData.password;
    if (!pwd) return { label: '', color: '', width: '0%' };
    
    let strength = 0;
    if (pwd.length >= 6) strength++;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;

    if (strength <= 2) return { label: 'Weak', color: 'bg-red-500', width: '33%' };
    if (strength === 3) return { label: 'Medium', color: 'bg-yellow-500', width: '66%' };
    return { label: 'Strong', color: 'bg-emerald-500', width: '100%' };
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-dark-950 bg-cyber-grid">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
            <img 
              src={logo} 
              alt="Apex Booking" 
              className="w-24 h-20 rounded-xl transition-transform group-hover:scale-110" 
              style={{ width: '6rem', height: '5rem' }}
            />
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
          <p className="text-dark-400">Join Apex Booking today</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label" htmlFor="name">Full Name *</label>
              <div className="relative">
                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input pl-11 ${errors.name && touched.name ? 'border-red-500' : ''}`}
                  placeholder="Enter your name"
                />
                {!errors.name && touched.name && formData.name && (
                  <FiCheck className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />
                )}
              </div>
              {errors.name && touched.name && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <FiX className="w-3 h-3" /> {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="label" htmlFor="email">Email Address *</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input pl-11 ${errors.email && touched.email ? 'border-red-500' : ''}`}
                  placeholder="Enter your email"
                />
                {!errors.email && touched.email && formData.email && (
                  <FiCheck className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />
                )}
              </div>
              {errors.email && touched.email && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <FiX className="w-3 h-3" /> {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="label" htmlFor="phone">Phone (Optional - Max 11 digits)</label>
              <div className="relative">
                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  maxLength="11"
                  className={`input pl-11 ${errors.phone && touched.phone ? 'border-red-500' : ''}`}
                  placeholder="Enter your phone"
                />
                {formData.phone && (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-dark-500">
                    {formData.phone.length}/11
                  </span>
                )}
              </div>
              {errors.phone && touched.phone && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <FiX className="w-3 h-3" /> {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label className="label" htmlFor="role">Account Type</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input"
              >
                <option value="customer">Customer - Book Services</option>
                <option value="provider">Service Provider - Offer Services</option>
              </select>
              {formData.role === 'provider' && (
                <p className="text-xs text-yellow-400 mt-1">
                  * Provider accounts require admin approval
                </p>
              )}
            </div>

            <div>
              <label className="label" htmlFor="password">Password *</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input pl-11 pr-11 ${errors.password && touched.password ? 'border-red-500' : ''}`}
                  placeholder="Create a password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-cyber-400 transition-colors"
                >
                  {showPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-dark-400">Password Strength:</span>
                    <span className={`font-medium ${
                      getPasswordStrength().label === 'Strong' ? 'text-emerald-400' :
                      getPasswordStrength().label === 'Medium' ? 'text-yellow-400' : 'text-red-400'
                    }`}>
                      {getPasswordStrength().label}
                    </span>
                  </div>
                  <div className="h-1.5 bg-dark-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${getPasswordStrength().color} transition-all duration-300`}
                      style={{ width: getPasswordStrength().width }}
                    />
                  </div>
                  <div className="mt-2 space-y-1 text-xs">
                    <p className={formData.password.length >= 6 ? 'text-emerald-400' : 'text-dark-500'}>
                      • At least 6 characters
                    </p>
                    <p className={/[A-Z]/.test(formData.password) ? 'text-emerald-400' : 'text-dark-500'}>
                      • One uppercase letter
                    </p>
                    <p className={/[a-z]/.test(formData.password) ? 'text-emerald-400' : 'text-dark-500'}>
                      • One lowercase letter
                    </p>
                    <p className={/\d/.test(formData.password) ? 'text-emerald-400' : 'text-dark-500'}>
                      • One number
                    </p>
                  </div>
                </div>
              )}
              {errors.password && touched.password && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <FiX className="w-3 h-3" /> {errors.password}
                </p>
              )}
            </div>

            <div>
              <label className="label" htmlFor="confirmPassword">Confirm Password *</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`input pl-11 pr-11 ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : ''}`}
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-cyber-400 transition-colors"
                >
                  {showConfirmPassword ? <FiEyeOff className="w-5 h-5" /> : <FiEye className="w-5 h-5" />}
                </button>
                {!errors.confirmPassword && touched.confirmPassword && formData.confirmPassword && (
                  <FiCheck className="absolute right-12 top-1/2 -translate-y-1/2 text-emerald-500" />
                )}
              </div>
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <FiX className="w-3 h-3" /> {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full hover:scale-[1.02] transition-transform"
            >
              {loading ? (
                <Loader size="sm" />
              ) : (
                <>
                  Create Account
                  <FiArrowRight />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-dark-400">
              Already have an account?{' '}
              <Link to="/login" className="link font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
