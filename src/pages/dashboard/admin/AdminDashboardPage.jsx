import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import UserList from '../../../components/admin/UserList';
import ReportModeration from '../../../components/admin/ReportModeration';
import { supabase } from '../../../config/supabase';
import DashboardLayout from '../../../components/layout/DashboardLayout';

const AdminDashboardPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('users').select('*');
      if (error) throw error;
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <DashboardLayout>
      <Routes>
        <Route path="users" element={<UserList users={users} loading={loading} fetchUsers={fetchUsers} />} />
        <Route path="reports" element={<ReportModeration />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminDashboardPage;