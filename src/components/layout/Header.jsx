import { Link } from 'react-router-dom';
import { PATHS } from '../../utils/pathUtils';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Header = () => {
  const { user, profile, logout, loading } = useAuth();

  const navLinkClasses = "text-muted-foreground hover:text-primary px-4 py-2 rounded-md text-sm font-medium transition-colors";

  return (
    <header className="bg-card shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to={PATHS.HOME} className="flex items-center">
          <img src="/SafePin Logo Green.svg" alt="SafePin Logo" className="h-10 mr-3" />
          <span className="text-3xl font-bold text-primary">SafePin</span>
        </Link>
        <nav className="flex items-center">
          {loading ? (
            <div className="animate-pulse h-8 w-24 bg-muted rounded-md"></div>
          ) : user ? (
            // User is logged in
            <>
              {profile?.role === 'admin' ? (
                <Link to={PATHS.ADMIN_DASHBOARD} className={navLinkClasses}>Dashboard</Link>
              ) : profile?.role === 'authority' ? (
                <Link to={PATHS.AUTHORITY_DASHBOARD} className={navLinkClasses}>Dashboard</Link>
              ) : (
                <Button asChild>
                  <Link to={PATHS.REPORT}>Report an Incident</Link>
                </Button>
              )}
              <Button onClick={logout} variant="destructive" className="ml-4">Logout</Button>
            </>
          ) : (
            // User is not logged in (guest)
            <>
              <Button asChild variant="ghost">
                <Link to="/track">Track a Report</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to={PATHS.LOGIN}>Login</Link>
              </Button>
              <Button asChild className="ml-4">
                <Link to={PATHS.REPORT}>Report an Incident</Link>
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;