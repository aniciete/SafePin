import { Link } from 'react-router-dom';
import { PATHS } from '../../utils/pathUtils';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { SunIcon, MoonIcon } from '@radix-ui/react-icons';
import { Button } from '../common/Button';

const Header = () => {
  const { user, profile, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const navLinkClasses = "text-text-secondary hover:text-primary px-4 py-2 rounded-md text-sm font-medium transition-colors";

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to={PATHS.HOME} className="flex items-center">
          <img src="/SafePin Logo Green.svg" alt="SafePin Logo" className="h-10 mr-3" />
          <span className="text-3xl font-bold text-primary-dark">SafePin</span>
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
                <Button asChild variant="primary">
                  <Link to={PATHS.REPORT}>Report an Incident</Link>
                </Button>
              )}
              <Button onClick={logout} variant="danger" className="ml-4">Logout</Button>
            </>
          ) : (
            // User is not logged in (guest)
            <>
              <Button asChild variant="secondary">
                <Link to="/track">Track a Report</Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to={PATHS.LOGIN}>Login</Link>
              </Button>
              <Button asChild variant="primary" className="ml-4">
                <Link to={PATHS.REPORT}>Report an Incident</Link>
              </Button>
            </>
          )}
          <Button variant="tertiary" onClick={toggleTheme} className="ml-4">
            {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default Header;