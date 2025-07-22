import { Routes, Route } from 'react-router-dom';
import UserList from '../../../components/admin/UserList';
import ReportModeration from '../../../components/admin/ReportModeration';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import GlobalSystemOverview from '../../../components/admin/GlobalSystemOverview';

const AdminDashboardPage = () => {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<GlobalSystemOverview />} />
        <Route path="users" element={<UserList />} />
        <Route path="reports" element={<ReportModeration />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AdminDashboardPage;