import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { FiHome, FiUsers, FiCreditCard, FiLogOut } from 'react-icons/fi';
import { AuthContext } from '../context/AuthContext.jsx';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: FiHome },
  { to: '/members', label: 'Members', icon: FiUsers },
  { to: '/payments', label: 'Payments', icon: FiCreditCard },
];

const Sidebar = () => {
  const { logout } = useContext(AuthContext);

  return (
    <aside className="w-56 flex-none bg-gray-700 text-gray-100 min-h-[calc(100vh-56px)] border-r border-gray-600">
      <div className="px-4 py-6 border-b border-gray-600">
        <h2 className="text-lg font-semibold">Finance Admin</h2>
        <p className="text-sm text-gray-300">Office panel</p>
      </div>

      <nav className="px-2 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded px-3 py-2 text-sm font-medium ${
                  isActive ? 'bg-gray-900 text-white' : 'text-gray-200 hover:bg-gray-600'
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-6 px-2 py-4 border-t border-gray-600">
        <button
          type="button"
          onClick={logout}
          className="w-full rounded bg-gray-800 px-3 py-2 text-left text-sm font-medium text-white hover:bg-gray-600"
        >
          <div className="flex items-center gap-2">
            <FiLogOut className="h-4 w-4" />
            Logout
          </div>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
