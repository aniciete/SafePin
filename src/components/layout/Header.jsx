import { useState } from 'react';
import { LogIn } from "lucide-react";
import { Link } from 'react-router-dom';
import { PATHS } from '../../utils/pathUtils';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const { user, profile, logout, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(prev => !prev);
  };

  const navLinkClasses = "text-muted-foreground hover:text-primary px-4 py-2 rounded-md text-sm font-medium transition-colors";
  const mobileNavLinkClasses = "block w-full text-left px-4 py-3 hover:bg-primary/10 rounded-md text-sm font-medium transition-colors";

  // Navigation links based on user role
  const renderNavLinks = (isMobile = false) => {
    const linkClass = isMobile ? mobileNavLinkClasses : navLinkClasses;
    
    if (loading) {
      return <div data-testid="loading-indicator" className="animate-pulse h-8 w-24 bg-muted rounded-md"></div>;
    }
    
    if (user) {
      // User is logged in
      return (
        <>
          {profile?.role === 'admin' ? (
            <Link 
              to={PATHS.ADMIN_DASHBOARD} 
              className={linkClass}
              onClick={() => isMobile && setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
          ) : profile?.role === 'authority' ? (
            <Link 
              to={PATHS.AUTHORITY_DASHBOARD} 
              className={linkClass}
              onClick={() => isMobile && setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
          ) : (
            <Button 
              asChild 
              variant={isMobile ? "outline" : "default"}
              className={isMobile ? "w-full justify-start" : ""}
              onClick={() => isMobile && setMobileMenuOpen(false)}
            >
              <Link to={PATHS.REPORT}>Report an Incident</Link>
            </Button>
          )}
          <Button 
            onClick={() => {
              logout();
              isMobile && setMobileMenuOpen(false);
            }} 
            variant="destructive" 
            className={isMobile ? "w-full mt-2" : "ml-4"}
          >
            Logout
          </Button>
        </>
      );
    } else {
      // User is not logged in (guest)
      return (
        <>
         <Button
            asChild
            variant={isMobile ? "outline" : "ghost"}
            className={isMobile ? "w-full justify-start" : "text-muted-foreground"}
            onClick={() => isMobile && setMobileMenuOpen(false)}
          >
            <Link to={PATHS.LOGIN} className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Authorized Dashboard
            </Link>
          </Button>
          <Button
            asChild
            className={isMobile ? "w-full mt-2" : "ml-4 bg-primary hover:bg-primary/90 text-white font-medium"}
            onClick={() => isMobile && setMobileMenuOpen(false)}
          >
            <Link to={PATHS.REPORT}>Report an Incident</Link>
          </Button>
        </>
      );
    }
  };

  return (
    <header className="bg-card shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to={PATHS.LANDING} className="flex items-center">
          <img src="/SafePin Logo Green.svg" alt="SafePin Logo" className="h-10 mr-3" />
          <span className="text-3xl font-bold text-primary">SafePin</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center">
          {renderNavLinks()}
        </nav>
        
        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="p-2"
            aria-label="Toggle menu"
          >
            <motion.div
              animate={mobileMenuOpen ? "open" : "closed"}
              className="w-6 h-6"
            >
              <motion.span
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: 45, y: 5 },
                }}
                className="block h-0.5 w-full bg-current"
              />
              <motion.span
                variants={{
                  closed: { opacity: 1 },
                  open: { opacity: 0 },
                }}
                className="block h-0.5 w-full bg-current my-1"
              />
              <motion.span
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: -45, y: -5 },
                }}
                className="block h-0.5 w-full bg-current"
              />
            </motion.div>
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
          >
            <nav className="container mx-auto px-6 py-4 flex flex-col space-y-2 border-t border-border">
              {renderNavLinks(true)}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;