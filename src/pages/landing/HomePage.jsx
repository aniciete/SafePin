import { Link } from 'react-router-dom';
import { PATHS } from '../../utils/pathUtils';
import { useAuth } from '../../contexts/AuthContext';

const HomePage = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Welcome to SafePin</h1>
      <nav>
        {user ? (
          <>
            {(user.role === 'authority' || user.role === 'admin') && (
              <Link to={PATHS.AUTHORITY_DASHBOARD}>Dashboard</Link>
            )}
            <button onClick={logout}>Logout</button>
          </>
        ) : (
          <>
            <Link to={PATHS.LOGIN}>Login</Link>
            <br />
            <Link to={PATHS.SIGNUP}>Sign Up</Link>
          </>
        )}
        <br />
        <Link to={PATHS.REPORT} style={{ marginTop: '1rem', display: 'inline-block', padding: '10px 20px', backgroundColor: '#28a745', color: 'white', textDecoration: 'none', borderRadius: '5px' }}>Report an Incident</Link>
      </nav>
    </div>
  );
};
export default HomePage;
