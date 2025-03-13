import React from 'react';
const TaskTracking = React.lazy(() => import("../../pages/task_management/TaskTracking"));
const AddTimeSheet = React.lazy(() => import("../../pages/task_management/AddTimeSheet"));
const ViewTask = React.lazy(() => import("../../pages/task_management/ViewTask"));
export const TaskRoutesList = {
    "childRoutes": [
        { path: "taskTracking", element: <TaskTracking /> },
        { path: "viewtask", element: <ViewTask /> },
        { path: "addTimeSheet", element: <AddTimeSheet /> },
    ]
}