import React from 'react';
const Permissions = React.lazy(() => import("../../pages/configuration/Permissions"));
const AddPermissions = React.lazy(() => import("../../pages/configuration/permissions/AddPermissions"));
const AssignUser = React.lazy(() => import("../../pages/configuration/AssignUser"));
export const PermissionRoutesList = {
    "childRoutes": [
        { path: "permissions", element: <Permissions /> },
        { path: "addPermission/:permissionId?", element: <AddPermissions /> },
        { path: "assignUser", element: <AssignUser /> },
    ]
}