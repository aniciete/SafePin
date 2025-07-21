import { Link } from 'react-router-dom';
import { PATHS } from '../../utils/pathUtils';
import { useAuth } from '../../contexts/AuthContext';

const Header = () => {
  const { user, profile, logout, loading } = useAuth();

  const navLinkClasses = "text-gray-600 hover:text-green-600 px-4 py-2 rounded-md text-sm font-medium transition-colors";
  const primaryButtonClasses = "bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105";
  const secondaryButtonClasses = "text-gray-600 hover:text-green-600 font-bold py-2 px-4 rounded-lg";
  const logoutButtonClasses = "bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg ml-4";


  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to={PATHS.HOME} className="flex items-center">
          <img src="/SafePin Logo Green.svg" alt="SafePin Logo" className="h-10 mr-3" />
          <span className="text-3xl font-bold text-green-700">SafePin</span>
        </Link>
        <nav className="flex items-center">
          {loading ? (
            <div className="animate-pulse h-8 w-24 bg-gray-300 rounded-md"></div>
          ) : user ? (
            // User is logged in
            <>
              {profile?.role === 'admin' ? (
                <Link to={PATHS.ADMIN_DASHBOARD} className={navLinkClasses}>Dashboard</Link>
              ) : profile?.role === 'authority' ? (
                <Link to={PATHS.AUTHORITY_DASHBOARD} className={navLinkClasses}>Dashboard</Link>
              ) : (
                <Link to={PATHS.REPORT} className={primaryButtonClasses}>Report an Incident</Link>
              )}
              <button onClick={logout} className={logoutButtonClasses}>Logout</button>
            </>
          ) : (
            // User is not logged in (guest)
            <>
              <Link to="/track" className={secondaryButtonClasses}>Track a Report</Link>
              <Link to={PATHS.LOGIN} className={secondaryButtonClasses}>Login</Link>
              <Link to={PATHS.REPORT} className={`${primaryButtonClasses} ml-4`}>Report an Incident</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;