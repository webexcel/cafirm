import React from 'react';
const TimeSheet = React.lazy(() => import("../../pages/timesheet/TimeSheet"));
const ClientTimeSheet = React.lazy(() => import("../../pages/timesheet/ClientTimeSheet"));
export const TimeSheetRoutesList = {
    "childRoutes": [
        { path: "AddTimesheet", element: <TimeSheet /> },
        { path: "viewTimeSheet", element: <ClientTimeSheet /> }
    ]
}