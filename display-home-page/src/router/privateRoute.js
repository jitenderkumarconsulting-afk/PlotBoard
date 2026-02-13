import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Route } from "react-router-dom";

const PrivateRoute = ({
  component: Component
}) => {
  const state = useSelector((store) => store.auth)
  if (state?.isAuthenticated) return <Component />;

  return <Navigate to="/" />;
};

export default PrivateRoute