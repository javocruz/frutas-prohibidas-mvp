import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider';
import { UserProvider } from './providers/UserProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { useAuthContext } from './providers/AuthProvider';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Rewards from './pages/Rewards';
import Receipts from './pages/Receipts';
import ReceiptsMaker from './pages/ReceiptsMaker';
import Admin from './pages/Admin';
import Profile from './pages/Profile';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { user } = useAuthContext();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { user, isInitializing } = useAuthContext();
  
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login />
          )
        }
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout>
              <Outlet />
            </Layout>
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="rewards" element={<Rewards />} />
        <Route path="receipts" element={<Receipts />} />
        <Route path="profile" element={<Profile />} />
        <Route
          path="admin"
          element={
            <ProtectedRoute requireAdmin>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="receipts-maker"
          element={
            <ProtectedRoute requireAdmin>
              <ReceiptsMaker />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <UserProvider>
            <Router>
              <AppRoutes />
            </Router>
          </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
