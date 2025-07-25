import { useAuth } from '../../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const AuthGuard = ({ children, role }) => {
  const { user, profile, loading } = useAuth();

  // 1. While the initial session is being determined, show a loading indicator.
  // This is the most important check and prevents premature redirects.
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Authenticating...</div>;
  }

  // 2. After loading is false, if there is no user, redirect to login.
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. If there IS a user but the profile is still loading, or the role doesn't match, redirect.
  // This handles the case where the user object is restored but the profile fetch isn't complete.
  // The check for profile is crucial.
  if (!profile || (role && profile.role !== role)) {
    // Redirect non-matching roles to the homepage.
    return <Navigate to="/" replace />;
  }

  // 4. If all checks pass, render the protected component.
  return children;
};

export default AuthGuard;