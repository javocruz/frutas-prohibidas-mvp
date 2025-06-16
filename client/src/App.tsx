import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider } from './providers/AuthProvider';
import { UserProvider } from './providers/UserProvider';
import { ThemeProvider } from './providers/ThemeProvider';
import { useAuthContext } from './providers/AuthProvider';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Rewards from './pages/Rewards';
import Receipts from './pages/Receipts';
import Admin from './pages/Admin';
import Layout from './components/Layout';
import ErrorBoundary from './components/ErrorBoundary';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireAdmin = false }) => {
  const { user, loading } = useAuthContext();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <UserProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
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
                  <Route
                    path="admin"
                    element={
                      <ProtectedRoute requireAdmin>
                        <Admin />
                      </ProtectedRoute>
                    }
                  />
                </Route>
              </Routes>
            </Router>
          </UserProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
