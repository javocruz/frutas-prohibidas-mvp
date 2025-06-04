import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../config/routes';

const NavigationLink = ({ to, children, icon }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`
        flex items-center px-4 py-2 text-sm font-medium rounded-md
        ${isActive 
          ? 'bg-brand text-white' 
          : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
        }
      `}
    >
      {icon && <span className="mr-3">{icon}</span>}
      {children}
    </Link>
  );
};

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile sidebar backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-neutral-600 bg-opacity-75 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 px-4 border-b border-neutral-200">
            <Link to={ROUTES.DASHBOARD} className="text-2xl font-bold text-brand">
              Frutas Prohibidas
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            <NavigationLink to={ROUTES.DASHBOARD} icon="📊">
              Dashboard
            </NavigationLink>
            <NavigationLink to={ROUTES.RECEIPTS} icon="🧾">
              Receipts
            </NavigationLink>
            <NavigationLink to={ROUTES.REWARDS} icon="🎁">
              Rewards
            </NavigationLink>
            {user?.role === 'admin' && (
              <NavigationLink to={ROUTES.ADMIN} icon="⚙️">
                Admin
              </NavigationLink>
            )}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-neutral-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-neutral-900">{user?.name}</p>
                <button
                  onClick={logout}
                  className="text-xs text-neutral-500 hover:text-neutral-700"
                >
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="md:pl-64">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex-1 md:flex-none md:ml-4">
              <h1 className="text-xl font-semibold text-neutral-900">
                {user?.name}'s Dashboard
              </h1>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="py-6">
          {children}
        </main>
      </div>
    </div>
  );
} 