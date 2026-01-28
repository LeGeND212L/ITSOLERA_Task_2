import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FiUser, FiMail, FiPhone, FiLock, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { updateProfile } from '../redux/slices/authSlice';
import authService from '../services/authService';
import Loader from '../components/common/Loader';

const Profile = () => {
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

  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    if (!profileData.name) {
      toast.error('Name is required');
      return;
    }

    const result = await dispatch(updateProfile(profileData));
    if (updateProfile.fulfilled.match(result)) {
      toast.success('Profile updated successfully');
    } else {
      toast.error(result.payload || 'Failed to update profile');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (!passwordData.currentPassword || !passwordData.newPassword) {
      toast.error('Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }

    try {
      setPasswordLoading(true);
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      toast.success('Password changed successfully');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const roleLabels = {
    admin: 'Administrator',
    provider: 'Service Provider',
    customer: 'Customer',
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Account Settings</h1>
        <p className="text-dark-400">Manage your profile and security settings</p>
      </div>

      {/* Profile Card */}
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
            <label className="label" htmlFor="name">Full Name</label>
            <div className="relative">
              <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
              <input
                type="text"
                id="name"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                className="input pl-11"
                placeholder="Your name"
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="email">Email Address</label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
              <input
                type="email"
                id="email"
                value={user?.email}
                className="input pl-11 bg-dark-900 text-dark-400"
                disabled
              />
            </div>
            <p className="text-dark-500 text-xs mt-1">Email cannot be changed</p>
          </div>

          <div>
            <label className="label" htmlFor="phone">Phone Number</label>
            <div className="relative">
              <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
                className="input pl-11"
                placeholder="Your phone number"
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? (
              <Loader size="sm" />
            ) : (
              <>
                <FiSave />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>

      {/* Change Password */}
      <div className="card">
        <h2 className="text-lg font-semibold text-white mb-6">Change Password</h2>

        <form onSubmit={handlePasswordSubmit} className="space-y-5">
          <div>
            <label className="label" htmlFor="currentPassword">Current Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="input pl-11"
                placeholder="Enter current password"
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="newPassword">New Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="input pl-11"
                placeholder="Enter new password"
              />
            </div>
          </div>

          <div>
            <label className="label" htmlFor="confirmPassword">Confirm New Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="input pl-11"
                placeholder="Confirm new password"
              />
            </div>
          </div>

          <button type="submit" disabled={passwordLoading} className="btn-secondary">
            {passwordLoading ? (
              <Loader size="sm" />
            ) : (
              <>
                <FiLock />
                Change Password
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
