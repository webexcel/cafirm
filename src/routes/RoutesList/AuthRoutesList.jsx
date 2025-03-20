import React from 'react';
const Login = React.lazy(() => import("../../pages/login/Login"));
const ResetPassword = React.lazy(() => import("../../pages/login/ResetPassword"));
const VerifyOtp = React.lazy(() => import("../../pages/login/VerifyOtp"));
export const authRoutesList = {
    "childRoutes": [
        { path: "/", element: <Login /> },
        { path: "login", element: <Login /> },
        { path: "forgot-password", element: <ResetPassword /> },
        { path: "verify-otp", element: <VerifyOtp /> }
    ]
}