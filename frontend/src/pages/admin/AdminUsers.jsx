import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FiSearch, FiTrash2, FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { fetchAllUsers, deleteUser } from '../../redux/slices/adminSlice';
import Loader from '../../components/common/Loader';

const AdminUsers = () => {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const dispatch = useDispatch();
  const { users, loading, pagination } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAllUsers({ search, role: roleFilter }));
  }, [dispatch, roleFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchAllUsers({ search, role: roleFilter }));
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const result = await dispatch(deleteUser(id));
      if (deleteUser.fulfilled.match(result)) {
        toast.success('User deleted successfully');
      } else {
        toast.error(result.payload || 'Failed to delete user');
      }
    }
  };

  const roleColors = {
    admin: 'bg-red-500/20 text-red-400',
    provider: 'bg-purple-500/20 text-purple-400',
    customer: 'bg-blue-500/20 text-blue-400',
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Manage Users</h1>
        <p className="text-dark-400">View and manage all registered users</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="input pl-11"
            />
          </div>
        </form>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="input w-full sm:w-48"
        >
          <option value="">All Roles</option>
          <option value="customer">Customers</option>
          <option value="provider">Providers</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader size="lg" text="Loading users..." />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-700">
                  <th className="text-left py-3 px-4 text-dark-400 font-medium text-sm">User</th>
                  <th className="text-left py-3 px-4 text-dark-400 font-medium text-sm">Email</th>
                  <th className="text-left py-3 px-4 text-dark-400 font-medium text-sm">Role</th>
                  <th className="text-left py-3 px-4 text-dark-400 font-medium text-sm">Status</th>
                  <th className="text-left py-3 px-4 text-dark-400 font-medium text-sm">Joined</th>
                  <th className="text-right py-3 px-4 text-dark-400 font-medium text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-dark-800 hover:bg-dark-800/50">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyber-500 to-primary-500 rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {user.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="text-white font-medium">{user.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-dark-300">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`badge capitalize ${roleColors[user.role]}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`badge ${user.isApproved ? 'badge-completed' : 'badge-pending'}`}>
                        {user.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-dark-400 text-sm">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {user.role !== 'admin' && (
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-dark-400">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
