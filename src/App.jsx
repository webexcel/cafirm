import React from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Scrolltop from "./components/common/scrolltop/scrolltop.jsx";
import { authRoutesList } from './routes/RoutesList/AuthRoutesList.jsx';
import { dashboardRoutesList } from './routes/RoutesList/AdminRouteslist.jsx';
import { ClientsRoutesList } from './routes/RoutesList/ClientMangamentRoutList.jsx';
import { TaskRoutesList } from './routes/RoutesList/TaskManagementRoutes.jsx';
import { TimeSheetRoutesList } from './routes/RoutesList/TimeRoutesList.jsx';
import { InvoiceRoutesList } from './routes/RoutesList/InvoiceRoutesList.jsx';
import { EmployeeRoutesList } from './routes/RoutesList/EmployeeRoutesList.jsx';
import { MasterClassRoutesList } from './routes/RoutesList/MasterClassRoutes.jsx';
import { AttendanceRoutes } from './routes/RoutesList/AttendanceRoutes.jsx';
import { PermissionRoutesList } from './routes/RoutesList/Configuration.jsx';
const AuthLayout = React.lazy(() => import("./layout/AuthLayout.jsx"));
const AdminLayout = React.lazy(() => import("./layout/AdminLayout.jsx"));
const App = () => {
    return (
        <React.Fragment>
            <BrowserRouter future={{ v7_startTransition: true }}>
                <Scrolltop />
                <React.Suspense>
                    <Routes>
                        <Route path={"/"} element={<AuthLayout />}>
                            {authRoutesList.childRoutes.map((route, index) => (
                                <Route key={index} path={route.path} element={route.element} />
                            ))}
                        </Route>

                        <Route path={"/"} element={<AdminLayout />}>
                            {dashboardRoutesList.childRoutes.map((route, index) => (
                                <Route key={index} path={route.path} element={route.element} />
                            ))}

                            {ClientsRoutesList.childRoutes.map((route, index) => (
                                <Route key={index} path={route.path} element={route.element} />
                            ))}

                            {TaskRoutesList.childRoutes.map((route, index) => (
                                <Route key={index} path={route.path} element={route.element} />
                            ))}

                            {TimeSheetRoutesList.childRoutes.map((route, index) => (
                                <Route key={index} path={route.path} element={route.element} />
                            ))}

                            {InvoiceRoutesList.childRoutes.map((route, index) => (
                                <Route key={index} path={route.path} element={route.element} />
                            ))}

                            {EmployeeRoutesList.childRoutes.map((route, index) => (
                                <Route key={index} path={route.path} element={route.element} />
                            ))}

                            {MasterClassRoutesList.childRoutes.map((route, index) => (
                                <Route key={index} path={route.path} element={route.element} />
                            ))}

                            {AttendanceRoutes.childRoutes.map((route, index) => (
                                <Route key={index} path={route.path} element={route.element} />
                            ))}

                            {PermissionRoutesList.childRoutes.map((route, index) => (
                                <Route key={index} path={route.path} element={route.element} />
                            ))}
                        </Route>
                    </Routes>
                </React.Suspense>
            </BrowserRouter>
        </React.Fragment>
    )
}

export default App
