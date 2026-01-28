import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  FiGrid,
  FiPackage,
  FiCalendar,
  FiUsers,
  FiUserCheck,
  FiSettings,
  FiBarChart2,
} from 'react-icons/fi';

const Sidebar = () => {
  const { user } = useSelector((state) => state.auth);

  const getMenuItems = () => {
    switch (user?.role) {
      case 'admin':
        return [
          { path: '/admin/dashboard', icon: FiGrid, label: 'Dashboard' },
          { path: '/admin/users', icon: FiUsers, label: 'Users' },
          { path: '/admin/providers', icon: FiUserCheck, label: 'Providers' },
          { path: '/admin/services', icon: FiPackage, label: 'Services' },
          { path: '/admin/bookings', icon: FiCalendar, label: 'Bookings' },
        ];
      case 'provider':
        return [
          { path: '/provider/dashboard', icon: FiGrid, label: 'Dashboard' },
          { path: '/provider/services', icon: FiPackage, label: 'My Services' },
          { path: '/provider/bookings', icon: FiCalendar, label: 'Bookings' },
        ];
      default:
        return [
          { path: '/customer/dashboard', icon: FiGrid, label: 'Dashboard' },
          { path: '/customer/bookings', icon: FiCalendar, label: 'My Bookings' },
          { path: '/services', icon: FiPackage, label: 'Browse Services' },
        ];
    }
  };

  const getSettingsPath = () => {
    switch (user?.role) {
      case 'admin':
        return '/admin/settings';
      case 'provider':
        return '/provider/settings';
      default:
        return '/customer/settings';
    }
  };

  const menuItems = getMenuItems();

  return (
    <aside className="fixed left-0 top-16 bottom-0 w-64 bg-dark-900 border-r border-dark-800 overflow-y-auto hidden lg:block">
      <div className="py-6">
        <div className="px-4 mb-6">
          <div className="flex items-center gap-3 p-3 bg-dark-800 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-cyber-500 to-primary-500 rounded-full flex items-center justify-center">
              <span className="text-white font-medium">
                {user?.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-dark-400 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        <nav className="px-3 space-y-1">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-cyber-500/10 text-cyber-400 border-l-2 border-cyber-500'
                    : 'text-dark-300 hover:text-white hover:bg-dark-800'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="px-3 mt-8">
          <NavLink
            to={getSettingsPath()}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-cyber-500/10 text-cyber-400'
                  : 'text-dark-300 hover:text-white hover:bg-dark-800'
              }`
            }
          >
            <FiSettings className="w-5 h-5" />
            <span className="font-medium">Settings</span>
          </NavLink>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
