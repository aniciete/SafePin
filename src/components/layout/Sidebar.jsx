import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <nav>
        <ul>
          <li><NavLink to="/dashboard/authority" end>Overview</NavLink></li>
          <li><NavLink to="/dashboard/authority/reports">Reports</NavLink></li>
          <li><NavLink to="/dashboard/authority/map">Map View</NavLink></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;