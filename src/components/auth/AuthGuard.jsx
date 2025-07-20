import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children, role }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && profile?.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AuthGuard;
