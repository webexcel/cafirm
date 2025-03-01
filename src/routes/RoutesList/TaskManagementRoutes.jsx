import React from 'react';
const TaskTracking = React.lazy(() => import("../../pages/task_management/TaskTracking"));
export const TaskRoutesList = {
    "childRoutes": [
        { path: "taskTracking", element: <TaskTracking /> }
    ]
}