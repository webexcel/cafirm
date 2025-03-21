import React from 'react';
const ActivityTracker = React.lazy(() => import("../../pages/attendance/ActivityTracker"));
const WorkTimeSheet = React.lazy(() => import("../../pages/attendance/WorkTimeSheet"));
export const AttendanceRoutes = {
    "childRoutes": [
        { path: "addAttendance", element: <ActivityTracker /> },
        { path: "viewAttendance", element: <WorkTimeSheet /> }
    ]
}