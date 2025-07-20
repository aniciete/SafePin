import { Routes, Route, Link } from 'react-router-dom';
import UserList from '../../../components/admin/UserList';
// Placeholder for ReportModeration component
// import ReportModeration from '../../../components/admin/ReportModeration';

const AdminDashboardPage = () => {
  return (
    <div style={{ display: 'flex' }}>
      <aside style={{ width: '200px', padding: '1rem', borderRight: '1px solid #ccc' }}>
        <nav>
          <ul>
            <li><Link to="/dashboard/admin/users">User Management</Link></li>
            {/* <li><Link to="/dashboard/admin/reports">Report Moderation</Link></li> */}
          </ul>
        </nav>
      </aside>
      <main style={{ flexGrow: 1, padding: '1rem' }}>
        <Routes>
          <Route path="users" element={<UserList />} />
          {/* <Route path="reports" element={<ReportModeration />} /> */}
        </Routes>
      </main>
    </div>
  );
};

export default AdminDashboardPage;