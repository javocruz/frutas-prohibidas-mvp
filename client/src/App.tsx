import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './providers/AuthProvider';
import { UserProvider } from './providers/UserProvider';
import { ROUTES } from './config/routes';
import ErrorBoundary from './components/ErrorBoundary';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Receipts from './pages/Receipts';
import Rewards from './pages/Rewards';
import Admin from './pages/Admin';
import LoadingSpinner from './components/LoadingSpinner';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

// Protected Route component
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuthContext();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to={ROUTES.LOGIN} />;
  if (requireAdmin && user.role !== 'admin') return <Navigate to={ROUTES.DASHBOARD} />;

  return <Layout>{children}</Layout>;
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <UserProvider>
          <Router>
            <Routes>
              <Route path={ROUTES.LOGIN} element={<Login />} />
              <Route
                path={ROUTES.DASHBOARD}
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.RECEIPTS}
                element={
                  <ProtectedRoute>
                    <Receipts />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.REWARDS}
                element={
                  <ProtectedRoute>
                    <Rewards />
                  </ProtectedRoute>
                }
              />
              <Route
                path={ROUTES.ADMIN}
                element={
                  <ProtectedRoute requireAdmin>
                    <Admin />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} />} />
            </Routes>
          </Router>
        </UserProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
};

export default App; 