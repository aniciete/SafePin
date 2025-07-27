import React from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, FileText, BarChart2, LogOut, Settings, X } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import logo from '/SafePin Logo Green.svg';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { profile, logout } = useAuth();
  const location = useLocation();

  const getLinkClass = (path, isEnd = false) => {
    const isActive = isEnd ? location.pathname === path : location.pathname.startsWith(path);
    return `flex items-center w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? 'bg-primary text-primary-foreground'
        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
    }`;
  };

  const isAdmin = profile?.role === 'admin';
  const isAuthority = profile?.role === 'authority';

  const sidebarContent = (
    <div className="flex flex-col h-full bg-card">
      {/* --- SIDEBAR HEADER (with mobile close button) --- */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border flex-shrink-0">
        <Link to="/" className="flex items-center gap-2" onClick={isOpen ? toggleSidebar : undefined}>
          <img src={logo} alt="SafePin Logo" className="h-8" />
          <span className="text-2xl font-bold text-primary">SafePin</span>
        </Link>
        {/* Mobile-only close button */}
        <Button variant="ghost" size="icon" className="lg:hidden" onClick={toggleSidebar}>
          <X className="h-6 w-6" />
        </Button>
      </div>

      <div className="flex flex-col justify-between flex-1 p-4 overflow-y-auto">
        <nav className="space-y-2">
          {isAdmin && (
            <>
              <NavLink to="/dashboard/admin" end className={getLinkClass('/dashboard/admin', true)} onClick={isOpen ? toggleSidebar : undefined}>
                <LayoutDashboard className="mr-3 h-5 w-5" /> Overview
              </NavLink>
              <NavLink to="/dashboard/admin/users" className={getLinkClass('/dashboard/admin/users')} onClick={isOpen ? toggleSidebar : undefined}>
                <Users className="mr-3 h-5 w-5" /> User Management
              </NavLink>
              <NavLink to="/dashboard/admin/reports" className={getLinkClass('/dashboard/admin/reports')} onClick={isOpen ? toggleSidebar : undefined}>
                <FileText className="mr-3 h-5 w-5" /> Report Moderation
              </NavLink>
              <NavLink to="/dashboard/admin/settings" className={getLinkClass('/dashboard/admin/settings')} onClick={isOpen ? toggleSidebar : undefined}>
                <Settings className="mr-3 h-5 w-5" /> Settings
              </NavLink>
            </>
          )}
          {isAuthority && (
            <>
              <NavLink to="/dashboard/authority" end className={getLinkClass('/dashboard/authority', true)} onClick={isOpen ? toggleSidebar : undefined}>
                <LayoutDashboard className="mr-3 h-5 w-5" /> Overview & Map
              </NavLink>
              <NavLink to="/dashboard/authority/analytics" className={getLinkClass('/dashboard/authority/analytics')} onClick={isOpen ? toggleSidebar : undefined}>
                <BarChart2 className="mr-3 h-5 w-5" /> Analytics
              </NavLink>
              <NavLink to="/dashboard/authority/settings" className={getLinkClass('/dashboard/authority/settings')} onClick={isOpen ? toggleSidebar : undefined}>
                <Settings className="mr-3 h-5 w-5" /> Settings
              </NavLink>
            </>
          )}
        </nav>

        <div className="mt-auto">
          <Button onClick={() => { logout(); if (isOpen) toggleSidebar(); }} variant="destructive" className="w-full justify-start px-4 py-2.5 h-auto">
            <LogOut className="mr-3 h-5 w-5" /> Logout
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* --- DESKTOP SIDEBAR (Static, always visible) --- */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 border-r border-border">
          {sidebarContent}
        </div>
      </div>

      {/* --- MOBILE SIDEBAR (Overlay, slides in and out) --- */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
              aria-hidden="true"
            />
            {/* Sidebar Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed top-0 left-0 z-40 h-full w-64 lg:hidden"
            >
              {sidebarContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;