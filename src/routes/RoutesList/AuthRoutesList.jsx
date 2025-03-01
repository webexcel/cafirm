import React from 'react';
const Login = React.lazy(() => import("../../pages/login/Login"));
export const authRoutesList = {
    "childRoutes": [
        { path: "/", element: <Login /> },
        { path: "login", element: <Login /> }
    ]
}