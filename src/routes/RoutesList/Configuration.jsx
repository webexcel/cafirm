import React from 'react';
const Permissions = React.lazy(() => import("../../pages/configuration/Permissions"));
const AddPermissions = React.lazy(() => import("../../pages/configuration/permissions/AddPermissions"));
export const PermissionRoutesList = {
    "childRoutes": [
        { path: "permissions", element: <Permissions /> },
        { path: "addPermission/:permissionId?", element: <AddPermissions /> },
    ]
}