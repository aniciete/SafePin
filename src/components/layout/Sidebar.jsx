import React from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Users, FileText, BarChart2, LogOut, Settings } from 'lucide-react'; 
import logo from '/SafePin Logo Green.svg';

const Sidebar = () => {
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

  return (
    <div className="flex flex-col w-64 h-full px-4 py-6 bg-card border-r border-border">
      {/* --- THIS IS THE FIX: Added the missing Logo/Title block --- */}
      <Link to="/" className="flex items-center justify-center px-4 mb-8 no-underline">
        <img src={logo} alt="SafePin Logo" className="h-10 mr-2" />
        <span className="text-3xl font-bold text-primary">SafePin</span>
      </Link>
      
      <div className="flex flex-col justify-between flex-1">
        <nav className="space-y-2">
          {isAdmin && (
            <>
              <NavLink to="/dashboard/admin" end className={getLinkClass('/dashboard/admin', true)}>
                <LayoutDashboard className="mr-3 h-5 w-5" /> Overview
              </NavLink>
              <NavLink to="/dashboard/admin/users" className={getLinkClass('/dashboard/admin/users')}>
                <Users className="mr-3 h-5 w-5" /> User Management
              </NavLink>
              <NavLink to="/dashboard/admin/reports" className={getLinkClass('/dashboard/admin/reports')}>
                <FileText className="mr-3 h-5 w-5" /> Report Moderation
              </NavLink>
              <NavLink to="/dashboard/admin/settings" className={getLinkClass('/dashboard/admin/settings')}>
                <Settings className="mr-3 h-5 w-5" /> Settings
              </NavLink>
            </>
          )}
          {isAuthority && (
            <>
              <NavLink to="/dashboard/authority" end className={getLinkClass('/dashboard/authority', true)}>
                <LayoutDashboard className="mr-3 h-5 w-5" /> Overview & Map
              </NavLink>
              <NavLink to="/dashboard/authority/analytics" className={getLinkClass('/dashboard/authority/analytics')}>
                <BarChart2 className="mr-3 h-5 w-5" /> Analytics
              </NavLink>
              <NavLink to="/dashboard/authority/settings" className={getLinkClass('/dashboard/authority/settings')}>
                <Settings className="mr-3 h-5 w-5" /> Settings
              </NavLink>
            </>
          )}
        </nav>

        <div className="mt-auto">
          <Button onClick={logout} variant="destructive" className="w-full justify-start px-4 py-2.5 h-auto">
            <LogOut className="mr-3 h-5 w-5" /> Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;