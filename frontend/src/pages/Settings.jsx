import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiUser, FiMail, FiPhone, FiLock, FiSave, FiCheck, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { updateProfile } from '../redux/slices/authSlice';
import authService from '../services/authService';
import Loader from '../components/common/Loader';

const Settings = () => {
  const { user, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [passwordLoading, setPasswordLoading] = useState(false);

  const validateField = (name, value, section = 'profile') => {
    let error = '';

    if (section === 'profile') {
      if (name === 'name' && !value.trim()) {
        error = 'Name is required';
      } else if (name === 'phone' && value && !/^\d+$/.test(value)) {
        error = 'Phone must contain only numbers';
      } else if (name === 'phone' && value.length > 11) {
        error = 'Phone must not exceed 11 digits';
      }
    } else if (section === 'password') {
      if (name === 'currentPassword' && !value) {
        error = 'Current password is required';
      } else if (name === 'newPassword') {
        if (!value) error = 'New password is required';
        else if (value.length < 6) error = 'Password must be at least 6 characters';
        else if (!/(?=.*[a-z])/.test(value)) error = 'Must contain lowercase letter';
        else if (!/(?=.*[A-Z])/.test(value)) error = 'Must contain uppercase letter';
        else if (!/(?=.*\d)/.test(value)) error = 'Must contain a number';
      } else if (name === 'confirmPassword' && value !== passwordData.newPassword) {
        error = 'Passwords do not match';
      }
    }

    return error;
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'phone' && value.length > 11) return;
    
    setProfileData({ ...profileData, [name]: value });
    
    if (touched[name]) {
      const error = validateField(name, value, 'profile');
      setErrors({ ...errors, [name]: error });
    }
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    
    if (touched[name]) {
      const error = validateField(name, value, 'password');
      setErrors({ ...errors, [name]: error });
    }
  };

  const handleBlur = (e, section) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    const error = validateField(name, value, section);
    setErrors({ ...errors, [name]: error });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    const newErrors = {};
    Object.keys(profileData).forEach(key => {
      const error = validateField(key, profileData[key], 'profile');
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fix validation errors');
      return;
    }

    const result = await dispatch(updateProfile(profileData));
    if (updateProfile.fulfilled.match(result)) {
      toast.success('Profile updated successfully');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {};
    Object.keys(passwordData).forEach(key => {
      const error = validateField(key, passwordData[key], 'password');
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    setTouched({ currentPassword: true, newPassword: true, confirmPassword: true });

    if (Object.keys(newErrors).length > 0) {
      toast.error('Please fix validation errors');
      return;
    }

    try {
      setPasswordLoading(true);
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password changed successfully');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setErrors({});
      setTouched({});
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const getPasswordStrength = () => {
    const pwd = passwordData.newPassword;
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

  const roleLabels = {
    admin: 'Administrator',
    provider: 'Service Provider',
    customer: 'Customer',
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-dark-400">Manage your account settings and preferences</p>
      </div>

      {/* Profile Info */}
      <div className="card">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-dark-700">
          <div className="w-16 h-16 bg-gradient-to-br from-cyber-500 to-primary-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-2xl">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-white">{user?.name}</h2>
            <p className="text-dark-400">{user?.email}</p>
            <span className="inline-block mt-1 px-3 py-1 bg-cyber-500/20 text-cyber-400 text-xs rounded-full">
              {roleLabels[user?.role]}
            </span>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-5">
          <div>
            <label className="label" htmlFor="name">Full Name *</label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
              <input
                type="text"
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                onBlur={(e) => handleBlur(e, 'profile')}
                className={`input pl-11 ${errors.name && touched.name ? 'border-red-500' : ''}`}
                placeholder="Your name"
              />
              {!errors.name && touched.name && profileData.name && (
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
            <label className="label" htmlFor="email">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
              <input
                type="email"
                id="email"
                value={user?.email}
                className="input pl-11 bg-dark-900 text-dark-400 cursor-not-allowed"
                disabled
              />
            </div>
            <p className="text-dark-500 text-xs mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="label" htmlFor="phone">Phone Number (Max 11 digits)</label>
            <div className="relative">
              <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
                onBlur={(e) => handleBlur(e, 'profile')}
                maxLength="11"
                className={`input pl-11 ${errors.phone && touched.phone ? 'border-red-500' : ''}`}
                placeholder="Your phone number"
              />
              {profileData.phone && (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-dark-500">
                  {profileData.phone.length}/11
                </span>
              )}
            </div>
            {errors.phone && touched.phone && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <FiX className="w-3 h-3" /> {errors.phone}
              </p>
            )}
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? <Loader size="sm" /> : <><FiSave /> Save Changes</>}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="card">
        <h2 className="text-lg font-semibold text-white mb-6">Change Password</h2>

        <form onSubmit={handlePasswordSubmit} className="space-y-5">
          <div>
            <label className="label" htmlFor="currentPassword">Current Password *</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                onBlur={(e) => handleBlur(e, 'password')}
                className={`input pl-11 ${errors.currentPassword && touched.currentPassword ? 'border-red-500' : ''}`}
                placeholder="Enter current password"
              />
            </div>
            {errors.currentPassword && touched.currentPassword && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <FiX className="w-3 h-3" /> {errors.currentPassword}
              </p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="newPassword">New Password *</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                onBlur={(e) => handleBlur(e, 'password')}
                className={`input pl-11 ${errors.newPassword && touched.newPassword ? 'border-red-500' : ''}`}
                placeholder="Enter new password"
              />
            </div>
            {passwordData.newPassword && (
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
              </div>
            )}
            {errors.newPassword && touched.newPassword && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <FiX className="w-3 h-3" /> {errors.newPassword}
              </p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="confirmPassword">Confirm New Password *</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                onBlur={(e) => handleBlur(e, 'password')}
                className={`input pl-11 ${errors.confirmPassword && touched.confirmPassword ? 'border-red-500' : ''}`}
                placeholder="Confirm new password"
              />
              {!errors.confirmPassword && touched.confirmPassword && passwordData.confirmPassword && (
                <FiCheck className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" />
              )}
            </div>
            {errors.confirmPassword && touched.confirmPassword && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <FiX className="w-3 h-3" /> {errors.confirmPassword}
              </p>
            )}
          </div>

          <button type="submit" disabled={passwordLoading} className="btn-secondary">
            {passwordLoading ? <Loader size="sm" /> : <><FiLock /> Change Password</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
