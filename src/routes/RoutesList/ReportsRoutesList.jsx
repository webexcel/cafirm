import React from 'react';
const EmployeeWeeklyReport = React.lazy(() => import("../../pages/reports/employee/EmployeeWeeklyReport"));
const EmployeeMonthlyReport = React.lazy(() => import("../../pages/reports/employee/EmployeeMonthlyReport"));
const EmployeeYearlyReport = React.lazy(() => import("../../pages/reports/employee/EmployeeYearlyReport"));
const EmployeeDatewiseReport = React.lazy(() => import("../../pages/reports/employee/EmployeeDatewiseReport"));
const ClientWeeklyReport = React.lazy(() => import("../../pages/reports/client/ClientWeeklyReport"));
const ClientMonthlyReport = React.lazy(() => import("../../pages/reports/client/ClientMonthlyReport"));
const ClientYearlyReport = React.lazy(() => import("../../pages/reports/client/ClientYearlyReport"));
const ClientDatewiseReport = React.lazy(() => import("../../pages/reports/client/ClientDatewiseReport"));
export const ReportsRoutesList = {
    "childRoutes": [
        // { path: "EmployeeWeeklyReport", element: <EmployeeWeeklyReport /> },
        // { path: "EmployeeMonthlyReport", element: <EmployeeMonthlyReport /> },
        // { path: "EmployeeAnnualReport", element: <EmployeeYearlyReport /> },
        { path: "EmployeeDateWiseReport", element: <EmployeeDatewiseReport /> },
        // { path: "ClientWeeklyReport", element: <ClientWeeklyReport /> },
        // { path: "ClientMonthlyReport", element: <ClientMonthlyReport /> },
        // { path: "ClientAnnualReport", element: <ClientYearlyReport /> },
        { path: "ClientDateWiseReport", element: <ClientDatewiseReport /> },
    ]
}