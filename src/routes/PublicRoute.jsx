import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../hooks/useAuthentication";
const PrivateRoutes = ({ children }) => {
  const isAuth = isAuthenticated();
  return !isAuth ? children : <Navigate to="/dashboard" />;
};

export default PrivateRoutes;
