import React from 'react';
const Permissions = React.lazy(() => import("../../pages/configuration/Permissions"));
const AddPermissions = React.lazy(() => import("../../pages/configuration/permissions/AddPermissions"));
const AssignUser = React.lazy(() => import("../../pages/configuration/AssignUser"));
const AddMenu = React.lazy(() => import("../../pages/configuration/AddMenu"));
const AddOperations = React.lazy(() => import("../../pages/configuration/AddOperations"));
export const PermissionRoutesList = {
    "childRoutes": [
        { path: "permissions", element: <Permissions /> },
        { path: "addPermission/:permissionId?", element: <AddPermissions /> },
        { path: "AddMenu", element: <AddMenu /> },
        // { path: "assignUser", element: <AssignUser /> },
        { path: "Operations", element: <AddOperations /> },
    ]
}