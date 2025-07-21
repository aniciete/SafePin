import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import UserList from '../../../components/admin/UserList';
import ReportModeration from '../../../components/admin/ReportModeration';
import { supabase } from '../../../config/supabase';

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
    <div style={{ display: 'flex' }}>
      <aside style={{ width: '200px', padding: '1rem', borderRight: '1px solid #ccc' }}>
        <nav>
          <ul>
            <li><Link to="/dashboard/admin/users">User Management</Link></li>
            <li><Link to="/dashboard/admin/reports">Report Moderation</Link></li>
          </ul>
        </nav>
      </aside>
      <main style={{ flexGrow: 1, padding: '1rem' }}>
        <Routes>
          <Route path="users" element={<UserList users={users} loading={loading} fetchUsers={fetchUsers} />} />
          <Route path="reports" element={<ReportModeration />} />
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboardPage;