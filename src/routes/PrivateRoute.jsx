import React from 'react'
import { Navigate } from "react-router-dom";
import { isAuthenticated } from '../hooks/useAuthentication';

const PrivateRoute = ({ children }) => {
    const isAuth = isAuthenticated();
    return !isAuth ? children : <Navigate to="/dashboard" />;
}

export default PrivateRoute
