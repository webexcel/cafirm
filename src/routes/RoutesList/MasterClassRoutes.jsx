import React from 'react';
const CreateService = React.lazy(() => import("../../pages/master_class/CreateService"));
export const MasterClassRoutesList = {
    "childRoutes": [
        { path: "createService", element: <CreateService /> },
    ]
}