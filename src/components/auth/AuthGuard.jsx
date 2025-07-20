import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children, role }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (role && user.user_metadata.role !== role) {
    return <Navigate to="/" />;
  }

  return children;
};

export default AuthGuard;
