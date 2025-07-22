import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../common/Button';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const getLinkClass = (path) => {
    const isActive = location.pathname.includes(path);
    return `flex items-center px-4 py-2 text-gray-700 rounded-md hover:bg-gray-200 dark:text-neutral-300 dark:hover:bg-neutral-700 ${
      isActive ? 'bg-gray-300 dark:bg-neutral-600 font-bold' : ''
    }`;
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="flex flex-col w-64 h-full px-4 py-8 bg-white border-r dark:bg-neutral-800 dark:border-neutral-700">
      <h2 className="text-3xl font-semibold text-center text-primary dark:text-primary">SafePin</h2>
      <div className="flex flex-col justify-between flex-1 mt-6">
        <nav>
          {isAdmin ? (
            <>
              <NavLink to="/dashboard/admin/users" className={getLinkClass('/dashboard/admin/users')}>
                User Management
              </NavLink>
              <NavLink to="/dashboard/admin/reports" className={getLinkClass('/dashboard/admin/reports')}>
                Report Moderation
              </NavLink>
            </>
          ) : (
            <>
              <NavLink to="/dashboard/authority" end className={getLinkClass('/dashboard/authority')}>
                Overview
              </NavLink>
              <NavLink to="/dashboard/authority/reports" className={getLinkClass('/dashboard/authority/reports')}>
                Reports
              </NavLink>
              <NavLink to="/dashboard/authority/map" className={getLinkClass('/dashboard/authority/map')}>
                Map View
              </NavLink>
            </>
          )}
        </nav>

        <div className="mt-auto">
          <Button onClick={logout} variant="danger" className="w-full">
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;