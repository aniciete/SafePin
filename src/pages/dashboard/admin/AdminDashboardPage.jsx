import React from 'react';
import Sidebar from '../../../components/layout/Sidebar';
import UserList from '../../../components/admin/UserList';
import AuthGuard from '../../../components/auth/AuthGuard';

const AdminDashboardPage = () => {
  return (
    <AuthGuard role="admin">
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <main style={{ flexGrow: 1, padding: '1rem' }}>
          <h1>Admin Dashboard</h1>
          <UserList />
        </main>
      </div>
    </AuthGuard>
  );
};

export default AdminDashboardPage;