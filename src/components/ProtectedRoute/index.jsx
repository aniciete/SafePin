import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAuthenticated, hasRole } from '../../services/auth';

const ProtectedRoute = ({ children, requiredRole }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    // Redirect to login page if not authenticated
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    // Redirect to home page if user doesn't have required role
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute; 