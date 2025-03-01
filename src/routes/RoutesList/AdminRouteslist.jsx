import React from 'react';
const Dashboard = React.lazy(() => import("../../pages/dashboard/Dashboard"));
export const dashboardRoutesList = {
    "childRoutes": [
        { path: "/", element: <Dashboard /> },
        { path: "dashboard", element: <Dashboard /> }
    ]
}

