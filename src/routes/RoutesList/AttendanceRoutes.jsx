import React from 'react';
const ActivityTracker = React.lazy(() => import("../../pages/attendance/ActivityTracker"));
export const AttendanceRoutes = {
    "childRoutes": [
        { path: "activityTracker", element: <ActivityTracker /> }
    ]
}