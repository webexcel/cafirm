import React from 'react';
const TimeSheet = React.lazy(() => import("../../pages/timesheet/TimeSheet"));
const ClientTimeSheet = React.lazy(() => import("../../pages/timesheet/ClientTimeSheet"));
const WeeklyTimeSheet = React.lazy(() => import("../../pages/timesheet/WeeklyTimeSheet"));
export const TimeSheetRoutesList = {
    "childRoutes": [
        { path: "weeklyTimeSheet", element: <WeeklyTimeSheet /> }
        { path: "AddTimesheet", element: <TimeSheet /> },
        { path: "viewTimeSheet", element: <ClientTimeSheet /> }
    ]
}