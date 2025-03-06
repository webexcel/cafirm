import React from 'react';
const TaskTracking = React.lazy(() => import("../../pages/task_management/TaskTracking"));
const AddTimeSheet = React.lazy(() => import("../../pages/task_management/AddTimeSheet"));
export const TaskRoutesList = {
    "childRoutes": [
        { path: "taskTracking", element: <TaskTracking /> },
        { path: "addTimeSheet", element: <AddTimeSheet /> },
    ]
}