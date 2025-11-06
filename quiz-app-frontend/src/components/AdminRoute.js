import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const AdminRoute = () => {
  const { isAuthenticated, isAdmin, status } = useSelector((state) => state.auth);

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return isAuthenticated && isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminRoute;