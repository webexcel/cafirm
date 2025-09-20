import React from 'react';
const AddManageClient = React.lazy(() => import("../../pages/client_mangement/AddManageClient"));
const AddService = React.lazy(() => import("../../pages/client_mangement/AddService"));
const ViewEditClientProfile = React.lazy(() => import("../../pages/client_mangement/ViewEditProfile"));

export const ClientsRoutesList = {
    "childRoutes": [
        { path: "CreateClients", element: <AddManageClient /> },
        // { path: "addService", element: <AddService /> },
        { path: "ViewEditProfiles", element: <ViewEditClientProfile /> },
        { path: "ViewEditProfiles/:id", element: <ViewEditClientProfile /> },
    ]
}