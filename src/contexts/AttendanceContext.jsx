import { createContext, useContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { addAttendanceLogin, addAttendanceLogout, checkTodayAttendance, getActivityAttendance } from "../service/attendance/activityTracker";

export const AttendanceContext = createContext(undefined);

export const useAttendanceContext = () => {
    const context = useContext(AttendanceContext);
    if (!context) {
        throw new Error('useAttendanceContext must be used within an AttendanceProvider');
    }
    return context;
};

export const AttendanceProvider = ({ children }) => {
    const [time, setTime] = useState(localStorage.getItem("time") ? Number(localStorage.getItem("time")) : 0);
    const [isRunning, setIsRunning] = useState(localStorage.getItem("isRunning") === "true");
    const [currentId, setCurrentId] = useState(null);
    const [initialData, setInitialData] = useState(null);

    useEffect(() => {
        let timer;
        if (isRunning) {
            timer = setInterval(() => {
                setTime((prevTime) => prevTime + 1);
            }, 1000);
        } else {
            clearInterval(timer);
        }
        return () => clearInterval(timer);
    }, [isRunning]);

    useEffect(() => {
        const checkInitialData = async () => {
            try {
                const userData = JSON.parse(Cookies.get('user'));
                const payload = {
                    "emp_id": userData?.employee_id || ''
                };
                const response = await checkTodayAttendance(payload);
                setInitialData(response.data.data[0] || {});
                if (response.data.data[0]?.logout_time === null) {
                    setIsRunning(true);
                }
            } catch (error) {
                console.error("Error fetching initial data:", error);
            }
        };
        checkInitialData();
        console.log("check attendance context")
    }, []);

    useEffect(() => {
        localStorage.setItem("time", time);
        localStorage.setItem("isRunning", isRunning);
    }, [time, isRunning]);

    const handleLogin = async () => {
        try {
            const userData = JSON.parse(Cookies.get('user'));
            const now = new Date();
            const payload = {
                "emp_id": userData.employee_id || '',
                "start_time": now.toTimeString().split(' ')[0],
                "start_date": now.toISOString().split('T')[0]
            };

            const response = await addAttendanceLogin(payload);
            if (response.data.status) {
                setCurrentId(response.data.data);
                setIsRunning(true);
            }
        } catch (error) {
            console.error("Error starting timer:", error);
        }
    };

    const handleLogout = async () => {
        try {
            const now = new Date();
            const payload = {
                "att_id": currentId || initialData?.attendance_id || '',
                "logout_date": now.toISOString().split('T')[0],
                "logout_time": now.toTimeString().split(' ')[0]
            };
            const response = await addAttendanceLogout(payload);
            if (response.data.status) {
                setIsRunning(false);
            }
        } catch (error) {
            console.error("Error stopping timer:", error);
        }
    };

    const value = {
        time,
        isRunning,
        handleLogin,
        handleLogout,
    };

    return (
        <AttendanceContext.Provider value={value}>
            {children}
        </AttendanceContext.Provider>
    );
};
