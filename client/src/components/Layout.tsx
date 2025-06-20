import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '../providers/AuthProvider';
import { ROUTES } from '../config/routes';
import { navigation } from '../config/navigation';
import symbolLogo from '../assets/symbol-logo.png';
import Modal from './Modal';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout, busy } = useAuthContext();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const renderIcon = (path: string) => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
    </svg>
  );

  const handleLogout = async () => {
    setLogoutModalOpen(true);
  };

  const confirmLogout = async () => {
    await logout();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } fixed inset-y-0 left-0 z-50 bg-white shadow-lg transition-all duration-300 ease-in-out transform ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } sm:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Logo and Toggle */}
          <div className="flex items-center justify-between p-4 border-b">
            <Link to={ROUTES.DASHBOARD} className="flex items-center">
              {isSidebarOpen && (
                <span className="text-xl font-bold text-brand">Frutas Prohibidas</span>
              )}
            </Link>
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden sm:block p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isSidebarOpen ? 'M11 19l-7-7 7-7m8 14l-7-7 7-7' : 'M13 5l7 7-7 7M5 5l7 7-7 7'}
                />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4">
            {navigation
              .filter(item => !item.requireAdmin)
              .map(item => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium ${
                    isActive(item.path)
                      ? 'bg-brand-50 text-brand border-r-4 border-brand'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="flex-shrink-0">{renderIcon(item.icon)}</span>
                  {isSidebarOpen && <span className="ml-3">{item.name}</span>}
                </Link>
              ))}

            {/* Admin Section Separator */}
            {user.role === 'admin' && navigation.some(item => item.requireAdmin) && (
              <>
                {isSidebarOpen && (
                  <div className="px-4 py-2 mt-4">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                      Admin Features
                    </div>
                  </div>
                )}
                {navigation
                  .filter(item => item.requireAdmin)
                  .map(item => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center px-4 py-3 text-sm font-medium ${
                        isActive(item.path)
                          ? 'bg-brand-50 text-brand border-r-4 border-brand'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <span className="flex-shrink-0">{renderIcon(item.icon)}</span>
                      {isSidebarOpen && <span className="ml-3">{item.name}</span>}
                    </Link>
                  ))}
              </>
            )}
          </nav>

          {/* User Info */}
          <div className="p-4 border-t">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-brand-100">
                  <span className="text-lg font-medium leading-none text-brand">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </span>
              </div>
              {isSidebarOpen && (
                <div className="ml-3">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                  <div className="text-xs text-gray-500">{user.email}</div>
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                      {user.points} points
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          {/* Logout Button */}
          <div className="p-4 border-t">
            <button
              onClick={handleLogout}
              disabled={busy}
              className={`w-full px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50 mt-2 ${
                busy ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Log Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 ${isSidebarOpen ? 'sm:ml-64' : 'sm:ml-20'} transition-all duration-300`}>
        {/* Mobile Header */}
        <div className="sm:hidden bg-white shadow-sm">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <span className="text-xl font-bold text-brand">Frutas Prohibidas</span>
          </div>
        </div>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        title="Confirm Logout"
        confirmText="Log Out"
      >
        Are you sure you want to log out of your account?
      </Modal>
    </div>
  );
};

export default Layout;
