import React from 'react';
const Documentation = React.lazy(() => import("../../pages/documentation/Documentation"));
export const DocumentRoutesList = {
    "childRoutes": [
        { path: "DocumentManagement", element: <Documentation /> },
    ]
}