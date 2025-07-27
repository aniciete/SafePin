import { useState, useEffect } from 'react';
import { LogIn } from "lucide-react";
import { Link } from 'react-router-dom';
import { PATHS } from '../../utils/pathUtils';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';

const Header = () => {
  const { user, profile, logout, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev);

  const navLinkClasses = "text-muted-foreground hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors";
  const mobileNavLinkClasses = "block w-full text-left px-4 py-3 hover:bg-muted/50 rounded-md text-sm font-medium transition-colors";

  const renderNavLinks = (isMobile = false) => {
    if (loading) {
      return <div className="animate-pulse h-8 w-24 bg-muted rounded-md"></div>;
    }
    
    if (user) {
      const dashboardPath = profile?.role === 'admin' ? PATHS.ADMIN_DASHBOARD : PATHS.AUTHORITY_DASHBOARD;
      return (
        <>
          <Link to={dashboardPath} className={isMobile ? mobileNavLinkClasses : navLinkClasses} onClick={() => isMobile && setMobileMenuOpen(false)}>
            Dashboard
          </Link>
          <Button onClick={() => { logout(); if (isMobile) setMobileMenuOpen(false); }} variant="destructive" className={isMobile ? "w-full mt-2" : "ml-2"}>
            Logout
          </Button>
        </>
      );
    } else {
      return (
        <>
          <Button asChild variant="ghost" className={isMobile ? mobileNavLinkClasses : navLinkClasses}>
            <Link to="/my-reports">Track a Report</Link>
          </Button>
          
          <Button asChild variant="ghost" className={isMobile ? mobileNavLinkClasses : navLinkClasses}>
            <Link to={PATHS.LOGIN} className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Authorized Login
            </Link>
          </Button>
          <Button asChild className={isMobile ? "w-full mt-2" : "ml-2"}>
            <Link to={PATHS.REPORT}>Report an Incident</Link>
          </Button>
        </>
      );
    }
  };

  return (
    <header className={cn("sticky top-0 z-50 transition-all duration-300 ease-out", isScrolled ? "bg-background/80 backdrop-blur-sm border-b border-border" : "bg-transparent border-b border-transparent")}>
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to={PATHS.LANDING} className="flex items-center gap-3">
          <img src="/SafePin Logo Green.svg" alt="SafePin Logo" className="h-10" />
          <span className="text-3xl font-bold text-primary">SafePin</span>
        </Link>
        
        <nav className="hidden md:flex items-center gap-2">
          {renderNavLinks()}
          <ThemeToggle />
        </nav>
        
        {/* --- THIS IS THE FIX --- */}
        <div className="md:hidden flex items-center">
          <ThemeToggle />
          {/* Convert the button to a shadcn Button for consistent styling and alignment */}
          <Button onClick={toggleMobileMenu} variant="ghost" size="icon" className="ml-2" aria-label="Toggle menu">
            <motion.div animate={mobileMenuOpen ? "open" : "closed"} className="w-6 h-6 flex flex-col items-center justify-center">
              <motion.span variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: 45, y: 5.5 } }} className="block h-0.5 w-5 bg-current" />
              <motion.span variants={{ closed: { opacity: 1 }, open: { opacity: 0 } }} className="block h-0.5 w-5 bg-current my-1" />
              <motion.span variants={{ closed: { rotate: 0, y: 0 }, open: { rotate: -45, y: -5.5 } }} className="block h-0.5 w-5 bg-current" />
            </motion.div>
          </Button>
        </div>
      </div>
      
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="md:hidden overflow-hidden border-t border-border">
            <nav className="container mx-auto px-6 py-4 flex flex-col space-y-2">
              {renderNavLinks(true)}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;