
import React, { useState } from 'react';
import {
  Home,
  Users,
  ShoppingCart,
  Package,
LogOutIcon,
  ChevronLeft,
  X
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../Context/Authcontext';
import { toast, } from 'react-toastify';
const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);
  const { logout } = useContext(AuthContext);
  const menuItems = [
    { name: 'Dashboard', icon: Home, path: '/dashbord' },
    { name: 'Users', icon: Users, path: '/allusers' },
    { name: 'Products', icon: Package, path: '/allproduct' },
    { name: 'Orders', icon: ShoppingCart, path: '/allorders' }
  ];

  const handleNavigation = (path) => {
    setActiveItem(path);
    navigate(path);
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };
    const handleLogout = () => {
       toast.success("Logout successful!"); 
    logout();
  };
  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed inset-y-0 left-0 z-30
          w-64 bg-white
          border-r border-gray-200
          transform transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:inset-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          shadow-xl
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <div>
              <h1 className="text-gray-900 font-bold text-xl">Adil</h1>
              <p className="text-gray-500 text-xs">chadhil@gmil.com</p>
            </div>
          </div>

          {/* Close button (mobile) */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Navigation menu */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.path;

            return (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.path)}
                className={`
                  w-full flex items-center px-4 py-3 rounded-lg text-left
                  transition-all duration-200
                  ${isActive
                    ? 'bg-blue-100 text-blue-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'}
                `}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-500'}`} />
                <span>{item.name}</span>
              </button>
            );
          })}
          {/* logout */}

<button onClick={handleLogout}>
  <LogOutIcon/>logout
</button>
        </nav>
      </div>

      {/* Toggle Button - Desktop */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-40 lg:left-64 p-2 bg-white rounded-lg shadow-lg border hover:shadow-xl transition-all duration-300 hidden lg:block"
        style={{
          transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
          opacity: sidebarOpen ? 1 : 0,
        }}
      >
        <ChevronLeft className="w-5 h-5 text-gray-600" />
      </button>
      </>
  );
};

export default Sidebar;
