import React from 'react';
const CreateService = React.lazy(() => import("../../pages/master_class/CreateService"));
const CreateDocType = React.lazy(() => import("../../pages/master_class/CreateDocType"));
export const MasterClassRoutesList = {
    "childRoutes": [
        { path: "createService", element: <CreateService /> },
        { path: "createDocType", element: <CreateDocType /> },
    ]
}