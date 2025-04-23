import React from 'react';
const ReportsByEmployee = React.lazy(() => import("../../pages/reports/ReportsByEmployee"));
const EmployeeWeeklyReport = React.lazy(() => import("../../pages/reports/employee/EmployeeWeeklyReport"));
const EmployeeMonthlyReport = React.lazy(() => import("../../pages/reports/employee/EmployeeMonthlyReport"));
const EmployeeYearlyReport = React.lazy(() => import("../../pages/reports/employee/EmployeeYearlyReport"));
const ClientWeeklyReport = React.lazy(() => import("../../pages/reports/client/ClientWeeklyReport"));
const ClientMonthlyReport = React.lazy(() => import("../../pages/reports/client/ClientMonthlyReport"));
const ClientYearlyReport = React.lazy(() => import("../../pages/reports/client/ClientYearlyReport"));
export const ReportsRoutesList = {
    "childRoutes": [
        { path: "EmployeeReports", element: <ReportsByEmployee /> },
        { path: "EmployeeWeeklyReport", element: <EmployeeWeeklyReport /> },
        { path: "EmployeeMonthlyReport", element: <EmployeeMonthlyReport /> },
        { path: "EmployeeAnnualReport", element: <EmployeeYearlyReport /> },
        { path: "ClientWeeklyReport", element: <ClientWeeklyReport /> },
        { path: "ClientMonthlyReport", element: <ClientMonthlyReport /> },
        { path: "ClientAnnualReport", element: <ClientYearlyReport /> },
    ]
}