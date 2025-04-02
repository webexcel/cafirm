import React, { useEffect, useState } from "react";
import { Card, Col, Row, Button } from "react-bootstrap";
import WeeklyCalenderLabel from './CalenderLabel';
import CustomForm from "../../components/custom/form/CustomForm";
import validateCustomForm from "../../components/custom/form/ValidateForm";
import useForm from "../../hooks/useForm";
import { WeeklyTimeSheetField } from "../../constants/fields/timesheetFields";
import { updateWeeklyTimesheet, viewWeeklyTimesheet } from "../../service/timesheet/employeeTimeSheet";
import Cookies from 'js-cookie';
import InputMask from 'react-input-mask';
import Swal from "sweetalert2";
import { getEmployee } from "../../service/employee_management/createEmployeeService";
import { usePermission } from "../../contexts";
const WeeklyTimeSheet = () => {
    const [formFields, setFormFields] = useState(WeeklyTimeSheetField);
    const [weeklydates, setWeeklyDate] = useState([]);
    const [weeklyAllData, setWeeklyAllData] = useState([]);
    const [headerData, setHeaderData] = useState([]);
    const [editRowIndex, setEditRowIndex] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [weeklyData, setWeeklyData] = useState([]);
    const [weeklyTotal, setWeeklyTotal] = useState([]);
    const { permissions, getOperationFlagsById } = usePermission();
    const [permissionFlags, setPermissionFlags] = useState(1);


    const initialFormState = WeeklyTimeSheetField.reduce((acc, field) => {
        acc[field.name] = "";
        return acc;
    }, {});

    const { formData, errors, handleInputChange, validateForm, resetForm, setFieldValue } = useForm(
        initialFormState,
        (data) => validateCustomForm(data, WeeklyTimeSheetField)
    );

    useEffect(() => {
        // Fetch field option data
        const fetchFieldOptionData = async () => {
            try {
                const payload = {
                };
                const employeeresponse = await getEmployee();
                console.log("Employee API Response:", employeeresponse);

                const updatedFormFields = WeeklyTimeSheetField.map((field) => {


                    if (field.name === "employee") {
                        console.log("Inner.....")
                        if (Array.isArray(employeeresponse.data.data) && employeeresponse.data.data.length > 0) {
                            const userData = JSON.parse(Cookies.get('user'));
                            console.log("userData111111111111111", userData);
                            if (userData?.role !== '1' && userData?.role !== '2') {
                                setFieldValue("employee", userData.employee_id);
                                console.log("userData11", userData);
                            }
                            console.log("userDatauserDatauserData", userData)
                            const employeeOptions = employeeresponse.data.data.map((item) => ({
                                value: item.employee_id,
                                label: item.name,
                            }));
                            console.log("Mapped Employee:", userData, field,
                                employeeOptions);
                            return {
                                ...field,
                                options: employeeOptions,
                                disabled: !['1', '2'].includes(String(userData?.role)) ? true : false,
                            };
                        } else {
                            console.error("Employee data response is not an array or is empty.");
                        }
                    }

                    return field;
                });
                setFormFields(updatedFormFields);
            } catch (error) {
                console.error("Error fetching class data:", error);
            }
        };
        fetchFieldOptionData()
    }, []);

    function getWeeklyDateRange(date = new Date()) {
        const today = new Date(date);
        const dayOfWeek = today.getDay();
        const lastSunday = new Date(today);
        lastSunday.setDate(today.getDate() - dayOfWeek);

        const weekDates = [];
        for (let i = 0; i < 7; i++) {
            let currentDate = new Date(lastSunday);
            currentDate.setDate(lastSunday.getDate() + i);

            const isToday =
                currentDate.getDate() === today.getDate() &&
                currentDate.getMonth() === today.getMonth() &&
                currentDate.getFullYear() === today.getFullYear();

            weekDates.push({
                date: currentDate.getDate(),
                day: currentDate.toLocaleDateString('en-US', { weekday: 'long' }),
                month: currentDate.toLocaleDateString('en-US', { month: 'long' }),
                active: isToday,
                fullDate: currentDate.toISOString().split('T')[0]
            });
        }
        return weekDates;
    }

    const addTime = (time1, time2) => {
        if (!time1) return time2;
        if (!time2) return time1;

        const [h1, m1] = time1.split(":").map(Number);
        const [h2, m2] = time2.split(":").map(Number);

        let totalMinutes = h1 * 60 + m1 + h2 * 60 + m2;
        let hours = Math.floor(totalMinutes / 60);
        let minutes = totalMinutes % 60;

        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
    };

    const formatTimesheetData = (timesheetData) => {
        console.log("Timesheet Data:", timesheetData);
        const currentWeek = getWeeklyDateRange();
        console.log("Current Week:", currentWeek);
        setWeeklyDate(currentWeek);
        const formattedData = timesheetData.reduce((acc, item) => {
            const taskKey = item.task_id || "Unknown Task";
            let exisitingEntry = acc.find((item) => item.task_id === taskKey);
            if (!exisitingEntry) {
                exisitingEntry = {
                    task_id: taskKey,
                    task_name: item.task_name || "Unknown Task",
                }
                currentWeek.forEach((day) => {
                    exisitingEntry[day.date] = null;
                });
                const timeSheetData = item.timesheet.reduce((acc, entry) => {
                    const entryDate = new Date(entry.date).getDate();
                    exisitingEntry[entryDate] = entry.total_time;
                    return acc;
                }, {});
                const prev = { ...exisitingEntry };
                exisitingEntry = { ...prev, ...timeSheetData };
                console.log("Time Sheet Data:", timeSheetData);
            }
            acc.push({ ...exisitingEntry });
            return acc;
        }, [])

        setWeeklyAllData(formattedData);
        console.log("formatdataaaaaaaaaaaaaaaaa", formattedData)

        const mergedData = formattedData.reduce((acc, curr) => {
            Object.keys(curr).forEach((key) => {
                if (!isNaN(key)) {
                    acc[key] = addTime(acc[key], curr[key]);
                }
            });
            return acc;
        }, {
            "task_name": "Task Name", "task_id": "Task ID"
            // ,"actions" : 'Actions'
        }
        );
        setWeeklyTotal(mergedData)
        console.log("Formatted Data:", formattedData, mergedData);
        const weeklyAllDate = getWeeklyDateRange().map((data) => data.date)
        const orderedHeaders = ['task_id', 'task_name', ...weeklyAllDate,
            // "actions"
        ];
        console.log("dateKeys", orderedHeaders, weeklyAllDate)
        setHeaderData(orderedHeaders);

    };

    const getWeeklyData = async (emp_id) => {
        try {
            const userData = JSON.parse(Cookies.get('user'));
            const payload = {
                emp_id: emp_id || userData?.employee_id || ''
            };
            const response = await viewWeeklyTimesheet(payload);
            setWeeklyData(response?.data?.data);
            console.log("response", response);
            if (response?.data?.status) {
                formatTimesheetData(response?.data?.data);
            }
        } catch (error) {
            console.log("Error fetching weekly data:", error);
        }
    };

    useEffect(() => {
        getWeeklyData();
        // const permissionFlags = getOperationFlagsById(10, 5); // paren_id , sub_menu id
        // console.log(permissionFlags, '---permissionFlags');
        // setPermissionFlags(permissionFlags);

    }, []);


    const handleEditClick = (index) => {
        setEditRowIndex(index);
        setEditedData({ ...weeklyAllData[index] });
    };

    const handleInputChangeInline = (dateKey, value) => {
        setEditedData((prev) => ({
            ...prev,
            [dateKey]: value
        }));
    };

    const handleSaveClick = async (row) => {
        try {
            const updatedData = [...weeklyAllData];
            updatedData[editRowIndex] = { ...editedData };
            setWeeklyAllData(updatedData);
            const filterData = weeklyData.filter((item) => row.task_id === item.task_id)[0]
            console.log("updateded dataa :", updatedData, editRowIndex)
            const currentDate = new Date().getDate();
            const newList = Object.keys(updatedData[editRowIndex])

                .filter(key => key !== "task_id" && key !== "task_name" && isPastOrToday(Number(key)))
                .map((key) => {
                    const matchedItem = filterData.timesheet.find(
                        (item) => new Date(item.date).getDate().toString() === key
                    );
                    return {
                        ts_id: matchedItem ? matchedItem.time_sheet_id : null,
                        ts_date: matchedItem ? matchedItem.date : weeklydates.map((item) => (item.fullDate)).find((item) => new Date(item).getDate().toString() === key),
                        time: updatedData[editRowIndex][key] || null
                    };
                }
                );

            console.log("newList", newList)

            const userData = JSON.parse(Cookies.get('user'));
            const result = {
                task_id: filterData.task_id,
                emp_id: userData?.employee_id,
                timesheets: newList,
            }

            const response = await updateWeeklyTimesheet({ data: result });
            if (!response?.data?.status) {
                console.log("Failed to updated timesheet");
                return Swal.fire("Error", response.data.message || "Failed to update weekly timesheet.", "error");

            }
            setEditRowIndex(null);
            Swal.fire("Success", `Weekly timesheet added successfully`, "success");
        }
        catch (error) {
            console.log("Error Occured while editing timesheet", error.stack);
        }

    };

    const today = new Date();
    const currentDate = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();


    const isPastOrToday = (day) => {
        const numericDay = Number(day);

        if (isNaN(numericDay)) return false;

        const todayFullDate = new Date(currentYear, currentMonth, currentDate);

        let dayFullDate = new Date(currentYear, currentMonth, numericDay);
        if (numericDay > currentDate + 20) {
            dayFullDate = new Date(currentYear, currentMonth - 1, numericDay);
        }

        return dayFullDate <= todayFullDate;
    };


    const handleCancelClick = () => {
        setEditRowIndex(null);
        setEditedData({});
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            getWeeklyData(formData?.employee);
        } catch (err) {
            console.error("Error while get weekly timesheet data:", err.stack);
            Swal.fire("Error", err.response?.data?.message || "Failed to get weekly timesheet data.", "error");
        }

    };

    return (
        <>
            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Body>
                            <Col xl={12}>
                                <CustomForm
                                    formFields={formFields}
                                    formData={formData}
                                    errors={errors}
                                    onChange={handleInputChange}
                                    onSubmit={handleAdd}
                                    btnText={'Submit'}
                                    showAddButton={true}
                                    showUpdateButton={permissionFlags?.showUPDATE}

                                />
                            </Col>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card>
                <table className="border-collapse border border-gray-300 w-full">
                    <thead>
                        <tr>
                            <th colSpan={headerData.length + 1} className="border border-gray-300 p-2">
                                <WeeklyCalenderLabel dateList={weeklydates} />
                            </th>
                        </tr>

                        {/* <tr className="bg-gray-200"> */}
                        {/* {headerData.map((header, index) => (
                                <th key={index} className="border border-gray-300 p-2 text-center">
                                    <span className="font-bold">
                                        {weeklydates.some((data) => data.date === parseInt(header)) ? 'Hours' : header}
                                    </span>
                                </th>
                            ))} */}
                        {weeklyAllData.length > 0 && (
                            <tr className="bg-gray-200">
                                {headerData.map((header, index) => (
                                    <th key={index} className="border border-gray-300 p-2 text-center">
                                        <span className="font-bold">
                                            {weeklyTotal[header]}
                                        </span>
                                    </th>
                                ))}
                                <th className="border border-gray-300 p-2 text-center">Actions</th>
                            </tr>
                        )}
                    </thead>

                    <tbody>
                        {weeklyAllData.length > 0 ? (
                            weeklyAllData.map((row, rowIndex) => (
                                <tr key={rowIndex} className="text-center">
                                    {headerData.map((header, index) => {

                                        const isEditable = editRowIndex === rowIndex &&
                                            !["task_id", "task_name"].includes(header) &&
                                            isPastOrToday(header);

                                        return (
                                            <td key={index} className="border border-gray-300 text-center" style={{
                                                width: ["task_id", "task_name"].includes(header) ? '160px' : '80px',
                                            }}>
                                                {isEditable ? (
                                                    <InputMask
                                                        mask="99:99"
                                                        maskChar={null}
                                                        value={editedData[header] || ""}
                                                        onChange={(e) => handleInputChangeInline(header, e.target.value)}
                                                        placeholder="HH:MM"
                                                        pattern="^([01]\d|2[0-3]):([0-5]\d)$"
                                                        title="Enter time in HH:MM format (24-hour)"
                                                        style={{
                                                            width: '50px',
                                                            border: '1px solid #ccc',
                                                            borderRadius: '5px',
                                                            padding: '5px',
                                                            outline: 'none',
                                                            boxShadow: '0 1px 1px rgba(0, 0, 0, 0.1)',
                                                            textAlign: 'center',
                                                            boxSizing: 'border-box',
                                                            fontSize: '11px'
                                                        }}
                                                        inputMode="numeric"
                                                    />
                                                ) : (
                                                    <span>{row[header] || ""}</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                    <td className="border border-gray-300 p-2">
                                        {editRowIndex === rowIndex ? (
                                            <>
                                                <Button variant="success" size="sm" onClick={() => handleSaveClick(row)} className="me-2">
                                                    <i className="bi bi-check-lg"></i>
                                                </Button>
                                                <Button variant="danger" size="sm" onClick={handleCancelClick}>
                                                    <i className="bi bi-x-lg"></i>
                                                </Button>
                                            </>
                                        ) : (
                                            <Button variant="primary" size="sm" onClick={() => handleEditClick(rowIndex)}>
                                                <i className="bi bi-pencil-square"></i>
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={headerData.length + 1} className="border border-gray-300 p-4 text-center text-gray-500">
                                    No weekly data found
                                </td>
                            </tr>
                        )}

                        {/* {weeklyAllData.length > 0 && (
                            <tr className="bg-gray-200">
                                {headerData.map((header, index) => (
                                    <th key={index} className="border border-gray-300 p-2 text-center">
                                        <span className="font-bold">
                                            {header === "task_name" ? 'Total' : weeklyTotal[header]}
                                        </span>
                                    </th>
                                ))}
                            </tr>
                        )} */}
                    </tbody>
                </table>
            </Card>


        </>
    );
};

export default WeeklyTimeSheet;
