// src/components/Auth/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthProvider';

const PrivateRoute = ({ children }) => {
  const { user, loading, userPlan } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/signup" />;
  }

  // If user exists but has no plan, redirect to plan selection
  if (!userPlan || userPlan ==null) {
    return <Navigate to="/select-plan" />;
  }

  return children;
};

export default PrivateRoute;