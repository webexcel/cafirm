import React from 'react';
const CreateService = React.lazy(() => import("../../pages/master_class/CreateService"));
const CreateDocType = React.lazy(() => import("../../pages/master_class/CreateDocType"));
const CreateFinYear = React.lazy(() => import("../../pages/master_class/CreateFinYear"));
export const MasterClassRoutesList = {
    "childRoutes": [
        { path: "createService", element: <CreateService /> },
        { path: "createDocType", element: <CreateDocType /> },
        { path: "createFinYear", element: <CreateFinYear /> },
    ]
}