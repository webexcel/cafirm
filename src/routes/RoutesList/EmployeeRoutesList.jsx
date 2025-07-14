import React from 'react';
const CreateEmployee = React.lazy(() => import("../../pages/employee_management/CreateEmployee"));
const ViewEditProfileEmp = React.lazy(() => import("../../pages/employee_management/ViewEditProfileEmp"));
const CreateUserAccount = React.lazy(() => import("../../pages/employee_management/CreateUserAccount"));
export const EmployeeRoutesList = {
    "childRoutes": [
        { path: "createEmployee", element: <CreateEmployee /> },
        { path: "vieweditprofile/:id", element: <ViewEditProfileEmp /> },
        { path: "vieweditprofile", element: <ViewEditProfileEmp /> },
        { path: "createuseraccount", element: <CreateUserAccount /> },
    ]
}