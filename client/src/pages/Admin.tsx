import React from 'react';

// TODO: Only allow access to users with admin role (already handled by ProtectedRoute in App.tsx)
// TODO: Add functionality to:
//   - Add new rewards
//   - Add points to users
//   - Manage and view metrics
//   - Admin dashboard features

const Admin: React.FC = () => (
  <div style={{ padding: 32 }}>
    <h1>Admin Page</h1>
    <p>Welcome, admin! This page will allow you to manage rewards, points, and metrics.</p>
    {/*
      Future features:
      - Add new rewards
      - Add points to users
      - View and manage metrics
      - Admin dashboard features
    */}
  </div>
);

export default Admin; 