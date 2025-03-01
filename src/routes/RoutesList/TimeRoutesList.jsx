import React from 'react';
const TimeSheet = React.lazy(() => import("../../pages/timesheet/TimeSheet"));
const ClientTimeSheet = React.lazy(() => import("../../pages/timesheet/ClientTimeSheet"));
export const TimeSheetRoutesList = {
    "childRoutes": [
        { path: "timeSheet", element: <TimeSheet /> },
        { path: "clientTimeSheet", element: <ClientTimeSheet /> }
    ]
}