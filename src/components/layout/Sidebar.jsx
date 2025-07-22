import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const { profile, logout } = useAuth(); // Changed from user to profile for role access
  const location = useLocation();

  // Updated getLinkClass to handle nested routes more accurately
  const getLinkClass = (path, isEnd = false) => {
    const isActive = isEnd ? location.pathname === path : location.pathname.startsWith(path);
    return `flex items-center px-4 py-2 text-muted-foreground rounded-md hover:bg-accent ${
      isActive ? 'bg-accent font-bold' : ''
    }`;
  };

  const isAdmin = profile?.role === 'admin';
  const isAuthority = profile?.role === 'authority';

  return (
    <div className="flex flex-col w-64 h-full px-4 py-8 bg-card border-r">
      <h2 className="text-3xl font-semibold text-center text-primary">SafePin</h2>
      <div className="flex flex-col justify-between flex-1 mt-6">
        <nav>
          {isAdmin && (
            <>
              <NavLink to="/dashboard/admin" className={getLinkClass('/dashboard/admin', true)}>
                Overview
              </NavLink>
              <NavLink to="/dashboard/admin/users" className={getLinkClass('/dashboard/admin/users')}>
                User Management
              </NavLink>
              <NavLink to="/dashboard/admin/reports" className={getLinkClass('/dashboard/admin/reports')}>
                Report Moderation
              </NavLink>
            </>
          )}
          {isAuthority && (
            <>
              <NavLink to="/dashboard/authority" end className={getLinkClass('/dashboard/authority', true)}>
                Overview & Map
              </NavLink>
              <NavLink to="/dashboard/authority/analytics" className={getLinkClass('/dashboard/authority/analytics')}>
                Analytics
              </NavLink>
            </>
          )}
        </nav>

        <div className="mt-auto">
          <Button onClick={logout} variant="destructive" className="w-full">
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;