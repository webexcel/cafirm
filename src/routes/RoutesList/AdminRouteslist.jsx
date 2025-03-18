import React from 'react';
const Dashboard = React.lazy(() => import("../../pages/dashboard/Dashboard"));
const Calender = React.lazy(() => import("../../pages/calender/Calender"));
export const dashboardRoutesList = {
    "childRoutes": [
        { path: "/", element: <Dashboard /> },
        { path: "dashboard", element: <Dashboard /> },
        { path: "calender", element: <Calender /> }
    ]
}

