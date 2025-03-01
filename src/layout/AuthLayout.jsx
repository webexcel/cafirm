import React, { useState, useEffect, Suspense } from 'react';
import Loader from '../components/common/loader/loader';
import PrivateRoute from '../routes/PrivateRoute';
import { Outlet } from 'react-router-dom';


const AuthLayout = () => {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const simulateLoading = setTimeout(() => {
            setIsLoading(false);
        }, 100);

        return () => clearTimeout(simulateLoading);
    }, []);

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <PrivateRoute>
                    <Outlet />
                </PrivateRoute>
            )}
        </>
    );
};

export default AuthLayout;
