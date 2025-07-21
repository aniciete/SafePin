import { Link } from 'react-router-dom';
import { PATHS } from '../../utils/pathUtils';
import { useAuth } from '../../contexts/AuthContext';

const HomePage = () => {
  const { user, profile, logout, loading } = useAuth();

  return (
    <div>
      <h1 className="sr-only">SafePin Home</h1>
      <nav>
        {loading ? (
          <p>Loading...</p>
        ) : user ? (
          // User is logged in
          <>
            <button onClick={logout}>Logout</button>
            <br />
            {profile?.role === 'admin' ? (
              <Link to={PATHS.ADMIN_DASHBOARD}>Dashboard</Link>
            ) : profile?.role === 'authority' ? (
              <Link to={PATHS.AUTHORITY_DASHBOARD}>Dashboard</Link>
            ) : (
              <Link to={PATHS.REPORT}>Report an Incident</Link>
            )}
          </>
        ) : (
          // User is not logged in (guest)
          <>
            <Link to={PATHS.LOGIN}>Login</Link>
            <br />
            <Link to="/track">Track a Report</Link>
            <br />
            <Link to={PATHS.REPORT} style={{ marginTop: '1rem', display: 'inline-block', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>Report an Incident</Link>
          </>
        )}
      </nav>
    </div>
  );
};
export default HomePage;
