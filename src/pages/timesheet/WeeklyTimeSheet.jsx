import React, { useEffect, useRef, useState } from "react";
import { Card, Col, Row, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
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
import DateLabel from "./DateLabel";
import CustomModal from "../../components/custom/modal/CustomModal";
import * as Yup from "yup";
import { getISOWeekNumber } from "../../utils/generalUtils";
import LoaderCon from "../../components/common/loader/loadercon";

const ModalTimesheetField = [
    {
        name: "task",
        label: "Task",
        placeholder: "Select Task",
        type: "multiSelect",
        options: [],
        required: true,
    },
];

const ModalTimesheetDetailsField = [
    {
        name: "description",
        label: "Description",
        placeholder: "Select Description",
        type: "textarea",
        required: true,
        disabled: false
    },
];


const WeeklyTimeSheet = () => {
    const [formFields, setFormFields] = useState(WeeklyTimeSheetField);
    const [formModalFields, setFormModalFields] = useState(ModalTimesheetField);
    const [formModalDetailFields, setFormModalDetailFields] = useState(ModalTimesheetDetailsField);
    const [weeklydates, setWeeklyDate] = useState([]);
    const [weeklyAllData, setWeeklyAllData] = useState([]);
    const [headerData, setHeaderData] = useState([]);
    const [editRowIndex, setEditRowIndex] = useState(null);
    const [editedData, setEditedData] = useState({});
    const [weeklyData, setWeeklyData] = useState([]);
    const [weeklyTotal, setWeeklyTotal] = useState([]);
    const { permissions, getOperationFlagsById } = usePermission();
    const [permissionFlags, setPermissionFlags] = useState(1);

    const [showModal, setShowModal] = useState(false);
    const [isDataEmpty, setIsDataEmpty] = useState(false)
    const inputRef = useRef();

    const [loader, setLoader] = useState(false)
    const validationSchema = Yup.object({
    });

    const [initialModalFields, setInitialModalFields] = useState(
        ModalTimesheetField.reduce((acc, item) => {
            acc[item.name] = item?.options ? [] : "";
            return acc;
        }, {})
    );
    const [initialModalDetailFields, setInitialModalDetailFields] = useState(
        ModalTimesheetDetailsField.reduce((acc, item) => {
            acc[item.name] = item?.options ? [] : "";
            return acc;
        }, {})
    );


    const [initialList, setInitialList] = useState([])
    const [showDetailModal, setShowDetailModal] = useState(false);
    const initialFormState = WeeklyTimeSheetField.reduce((acc, field) => {
        acc[field.name] = "";
        return acc;
    }, {});

    const { formData, errors, handleInputChange, validateForm, resetForm, setFieldValue } = useForm(
        initialFormState,
        (data) => validateCustomForm(data, WeeklyTimeSheetField)
    );

    useEffect(() => {
        const fetchFieldOptionData = async () => {
            try {
                const employeeresponse = await getEmployee();
                const updatedFormFields = WeeklyTimeSheetField.map((field) => {
                    if (field.name === "employee") {
                        if (Array.isArray(employeeresponse.data.data) && employeeresponse.data.data.length > 0) {
                            const userData = JSON.parse(Cookies.get('user'));
                            if (Number(userData?.role) !== 1 || Number(userData?.role) !== 2) {
                                setFieldValue("employee", userData.employee_id);
                                // console.log("userData11", userData);
                            }
                            else {
                                setFieldValue("employee", 8);
                            }
                            const employeeOptions = employeeresponse.data.data.map((item) => ({
                                value: item.employee_id,
                                label: item.name,
                            }));
                            return {
                                ...field,
                                options: employeeOptions,

                                // disabled: userData?.role !== "1" || userData?.role !== "2" ? true : false,
                                disabled: !["1", "2"].includes(String(userData?.role)) ? true : false

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

        // Clone today's date and go back to the most recent Sunday
        const lastSunday = new Date(today);
        lastSunday.setDate(today.getDate() - dayOfWeek);

        const weekDates = [];

        for (let i = 0; i < 7; i++) {
            const currentDate = new Date(lastSunday);
            currentDate.setDate(lastSunday.getDate() + i); // Do NOT mutate original 'lastSunday'

            // Validate currentDate
            if (isNaN(currentDate.getTime())) {
                console.warn("Invalid date at index", i);
                continue; // Skip this loop if date is invalid
            }

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


    useEffect(() => {
        console.log("formData.weekly_id :", formData.weekly_id)
        if (formData.weekly_id) {
            const date = new Date(formData.weekly_id)
            const selectedWeek = getWeeklyDateRange(date)
            setWeeklyDate(selectedWeek)
            console.log("selectedWeek : ", selectedWeek)
        }
    }, [formData.weekly_id])

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
        const currentWeek = getWeeklyDateRange();
        console.log("Current Week:", currentWeek, timesheetData);
        setWeeklyDate(currentWeek);

        const formattedData = timesheetData.reduce((acc, item) => {
            const taskKey = item.task_id || "Unknown Task";
            let exisitingEntry = acc.find((item) => item.task_id === taskKey);

            if (!exisitingEntry) {
                exisitingEntry = {
                    task_id: taskKey,
                    task_name: `${item.task_name} - ${item.year_name}` || "Unknown name"
                };

                // Initialize each date with { time: null, description: "" }
                currentWeek.forEach((day) => {
                    exisitingEntry[day.date] = { time: null, description: "" };
                });

                console.log("exisitingEntryexisitingEntry", exisitingEntry);

                // Fill actual timesheet data
                item.timesheet.forEach((entry) => {
                    const entryDate = new Date(entry.date).getDate();
                    exisitingEntry[entryDate] = {
                        time: entry.total_time || null,
                        description: entry.description || ""
                    };
                });

                console.log("Time Sheet Data:", item.timesheet);
            }

            acc.push({ ...exisitingEntry });
            return acc;
        }, []);

        setWeeklyAllData(formattedData);

        const filterHeadData = Object.keys(formattedData[0]).filter(
            (item) => item !== "task_id" && item !== "task_name"
        );

        const filteredTaskData = formattedData.filter((dataItem) => {
            return filterHeadData.some((key) => dataItem[key]?.time !== null);
        });

        const mergedData = formattedData.reduce((acc, curr) => {
            Object.keys(curr).forEach((key) => {
                if (!isNaN(key)) {
                    const time = curr[key]?.time;
                    acc[key] = addTime(acc[key], time);
                }
            });
            return acc;
        }, {
            "task_name": "Task Name",
            "task_id": "Task ID"
        });

        setWeeklyTotal(mergedData);
        console.log("Formatted Data:", formattedData, mergedData);

        const weeklyAllDate = getWeeklyDateRange().map((data) => data.date);
        const orderedHeaders = ['task_id', 'task_name', ...weeklyAllDate];

        setIsDataEmpty(formattedData.length === 0 ? false : true);
        setInitialList([]);
        console.log("dateKeys", orderedHeaders, weeklyAllDate);
        setHeaderData(orderedHeaders);
    };

    const getWeeklyData = async (emp_id, selecteddate) => {
        console.log("getWeeklyData called with emp_id:", emp_id, "and selecteddate:", selecteddate);
        setLoader(true)
        setInitialList([]);
        setWeeklyAllData([]);
        setWeeklyTotal({});

        try {
            const userData = JSON.parse(Cookies.get('user'));
            const date = selecteddate;
            const weekid = getISOWeekNumber(date);
            const yearid = date.getFullYear();
            setFieldValue("weekly_id", date);
            const payload = {
                emp_id: emp_id || userData?.employee_id || '',
                week_id: weekid,
                year: yearid
            };
            console.log("API payload:", payload);
            const response = await viewWeeklyTimesheet(payload);
            console.log("API response:", response);
            if (response?.data?.status && Array.isArray(response?.data?.data) && response?.data?.data.length > 0) {
                setWeeklyData(response.data.data);
                formatTimesheetData(response.data.data);
                setLoader(false)
            } else {
                Swal.fire("No Data", "No weekly data found for this employee in the selected week.", "warning");
                console.log("No timesheet data returned for selected employee/week.");
                // setWeeklyData([]);
                setInitialList([]);
                setWeeklyAllData([]);
                setWeeklyTotal({});
                setLoader(false)
            }
        } catch (error) {
            console.error("Error fetching weekly data:", error);
            setLoader(false)
            Swal.fire("Error", "Failed to load weekly timesheet data.", "error");
        }
        finally {
            setLoader(false)
        }
    };

    const today = new Date();
    const currentDate = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    useEffect(() => {
        const userData = JSON.parse(Cookies.get('user'));
        if (Number(userData?.role) !== 1) {
            getWeeklyData(userData?.employee_id, today);
        }
        else {
            setFieldValue("employee", "")
            const date = today;
            setFieldValue("weekly_id", date);
        }
        const currentWeek = getWeeklyDateRange();
        console.log("Current Week:", currentWeek);
        setWeeklyDate(currentWeek);
        const permissionFlags = getOperationFlagsById(13, 3); // paren_id , sub_menu id
        console.log(permissionFlags, '---permissionFlags', today);
        setPermissionFlags(permissionFlags);

    }, []);

    const handleEditClick = (index) => {
        setEditRowIndex(index);
        console.log("check :", initialList[index], editedData, index)
        setEditedData({ ...initialList[index] });
    };

    const handleInputChangeInline = (dateKey, value, row) => {
        console.log("testtt : ", dateKey, value, row)
        // const filterData = initialList.filter((item) => Number(item.))
        // setEditedData((prev) => ({
        //     ...prev,
        //     [dateKey]: value
        // }));

        const filterData = initialList.map((data, index) => {
            if (Number(data.task_id) === Number(row.task_id)) {
                return { ...data, [dateKey]: { ...data[dateKey], time: value } }
            }
            return data;
        })
        setInitialList(filterData)
        console.log("filterData : ", filterData)
    };

    const handleSaveClick = async (row) => {
        try {
            console.log("row", weeklyTotal, row, initialList, editedData, editRowIndex)
            const updatedData = [...initialList];
            // updatedData[editRowIndex] = { ...editedData };
            console.log("updatedData[editRowIndex]", updatedData, initialList)
            setInitialList(initialList);
            const filterData = weeklyData.filter((item) => row.task_id === item.task_id)[0]
            console.log("updateded dataa :", updatedData, editRowIndex)
            const mergedData = updatedData.reduce((acc, curr) => {
                Object.keys(curr).forEach((key) => {
                    if (!isNaN(key)) {
                        acc[key] = addTime(acc[key], curr[key]);
                    }
                });
                return acc;
            }, {
                "task_name": "Task Name", "task_id": "Task ID"
            }
            );
            setWeeklyTotal(mergedData)
            const newList = Object.keys(updatedData[editRowIndex])
                .filter(key => key !== "task_id" && key !== "task_name" && isPastOrToday(Number(key)))
                .map((key) => {
                    const matchedItem = filterData.timesheet.find(
                        (item) => new Date(item.date).getDate().toString() === key
                    );
                    return {
                        ts_id: matchedItem ? matchedItem.time_sheet_id : null,
                        ts_date: matchedItem ? matchedItem.date : weeklydates.map((item) => (item.fullDate)).find((item) => new Date(item).getDate().toString() === key),
                        time: updatedData[editRowIndex][key].time || null,
                        description: updatedData[editRowIndex][key].description || null
                    };
                }
                );

            console.log("newList", newList)

            const result = {
                task_id: filterData.task_id,
                emp_id: formData?.employee,
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
        setLoader(true)
        try {
            getWeeklyData(formData?.employee, formData?.weekly_id);
        } catch (err) {
            setLoader(false)
            console.error("Error while get weekly timesheet data:", err.stack);
            Swal.fire("Error", err.response?.data?.message || "Failed to get weekly timesheet data.", "error");
        }
        finally {
            setLoader(false)
        }

    };

    const currentMonthName = today.toLocaleString('en-US', { month: 'long' })

    const getWeeklyTaskData = () => {
        setShowModal(true)
        setInitialModalFields((prev) => ({
            ...prev,
            task: initialList.map((item) => ({ label: item.task_name, value: item.task_id }))
        }))

        setFormModalFields((prev) =>
            prev.map((field) =>
                field.name === "task"
                    ? {
                        ...field,
                        options: weeklyAllData.map((item) => ({ label: item.task_name, value: item.task_id }))
                    }
                    : field
            )
        );
    }

    const handleSubmit = async (values) => {
        console.log("Submitted Values:", values);
        console.log("Weekly All Data:", weeklyAllData);

        // Filter matching tasks based on selected task values
        const filtered = weeklyAllData.filter((dataItem) =>
            values.task?.some((selectedItem) => selectedItem.value === dataItem.task_id)
        );

        console.log("filtered : ", filtered)

        // Directly set the filtered result
        setInitialList(filtered);
        setShowModal(false);
    };


    const openDetailModal = (tasklist, selectedData, key) => {
        setShowDetailModal(true)
        // console.log("task_name", tasklist,selectedData, initialModalDetailFields)
        setInitialModalDetailFields((prev) => ({ ...selectedData, id: key, task_id: tasklist.task_id }))
    }

    const handleDetailSubmit = (value) => {
        console.log("valuess", value, initialModalDetailFields, initialList);
        const filterr = initialList.filter((data) => Number(data.task_id) != Number(value.task_id))
        const filter1 = initialList.find((data) => Number(data.task_id) === Number(value.task_id))
        const filterObject = { ...filter1, [value.id]: initialList[value.id] = { ...filter1[value.id], description: value.description } }
        console.log("filterr :", filterr, filter1['4'], filter1, filterObject)
        const test = [...filterr, filterObject]
        console.log("testtt : ", test)
        setInitialList(test)
        setShowDetailModal(false)

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
                <table className="table table-bordered w-100">
                    <thead>
                        <tr>
                            <th className="fs-18 fw-bolder text-center" colSpan={2} style={{ width: "12%", borderRight: "none" }}>
                                <div>
                                    <span className="me-2">
                                        {currentMonthName}
                                    </span>
                                    <span>
                                        {currentYear}
                                    </span>
                                </div>
                                <span className="ms-3 fs-13 text-muted">
                                    {`Week : ${formData?.weekly_id ? getISOWeekNumber(formData?.weekly_id) : getISOWeekNumber(today)}`}
                                </span>
                            </th>

                            {weeklydates.map((data, index) => (
                                <th key={index} className="text-center fw-bold" style={{ width: "auto" }}>
                                    <DateLabel {...data} />
                                </th>
                            ))}
                        </tr>

                        {initialList.length !== 0 && (
                            <tr className="bg-light">
                                {headerData.map((header, index) => {
                                    const isFixedWidth = ["task_id", "task_name"].includes(header) ? "5%" : "auto";
                                    return (
                                        <th key={index} className="text-center fw-bold" style={{ width: isFixedWidth }}>
                                            {typeof weeklyTotal[header] === "object"
                                                ? weeklyTotal[header]?.time || ""
                                                : weeklyTotal[header] || ""}
                                        </th>
                                    );
                                })}
                                <th className="text-center fw-bold" style={{ width: "10%" }}>Actions</th>
                            </tr>

                        )}
                    </thead>

                    <tbody>
                        {isDataEmpty ? (

                            <>
                                {initialList.map((row, rowIndex) => (
                                    <tr key={rowIndex} className="text-center">
                                        {headerData.map((header, index) => {
                                            const isFixedWidth = ["task_id"].includes(header) ? "8%" :
                                                ["task_name"].includes(header) ? "17%" : "auto";

                                            const isEditable =
                                                editRowIndex === rowIndex &&
                                                !["task_id", "task_name"].includes(header) &&
                                                isPastOrToday(header);

                                            return (
                                                <td key={index} style={{ width: isFixedWidth }}>
                                                    {isEditable ? (
                                                        <div className="d-flex align-items-center gap-1">
                                                            <InputMask
                                                                inputRef={inputRef}
                                                                mask="99:99"
                                                                maskChar={null}
                                                                value={row[header]?.time || ""}
                                                                onChange={(e) => handleInputChangeInline(header, e.target.value, row)}
                                                                placeholder="HH:MM"
                                                                className="form-control form-control-sm text-center"
                                                                inputMode="numeric"
                                                            />

                                                            <OverlayTrigger
                                                                placement="top"
                                                                overlay={
                                                                    <Tooltip
                                                                        id={`tooltip-${header}`}
                                                                        className="custom-tooltip"
                                                                    >
                                                                        {["task_id", "task_name"].includes(header)
                                                                            ? row[header] || ""
                                                                            : row[header]?.description || "No description"}
                                                                    </Tooltip>
                                                                }
                                                            >
                                                                <Button
                                                                    variant="primary"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        openDetailModal(row, editedData?.[header] || {}, header)
                                                                    }
                                                                    className="ms-1"
                                                                >
                                                                    <i className="bi bi-info-circle"></i>
                                                                </Button>
                                                            </OverlayTrigger>

                                                        </div>
                                                    ) : (
                                                        <span className="d-block w-100">
                                                            {["task_id", "task_name"].includes(header)
                                                                ? row[header] || ""
                                                                : row[header]?.time || ""}
                                                        </span>
                                                    )}
                                                </td>

                                            );
                                        })}

                                        <td className="text-center" style={{ minWidth: "100px" }}>
                                            {editRowIndex === rowIndex ? (
                                                <div className="d-flex justify-content-center gap-2">
                                                    <Button variant="success" size="sm" onClick={() => handleSaveClick(row)}>
                                                        <i className="bi bi-check-lg"></i>
                                                    </Button>
                                                    <Button variant="danger" size="sm" onClick={handleCancelClick}>
                                                        <i className="bi bi-x-lg"></i>
                                                    </Button>
                                                </div>
                                            ) : (
                                                <Button variant="primary" size="sm" onClick={() => handleEditClick(rowIndex)}>
                                                    <i className="bi bi-pencil-square"></i>
                                                </Button>
                                            )}
                                        </td>
                                    </tr>
                                ))}

                                <tr style={{ cursor: "pointer" }}>
                                    <td colSpan={headerData.length + 1}>
                                        <div className="d-flex align-items-center text-primary fw-bold py-1 px-4" onClick={getWeeklyTaskData}>
                                            <i className="bi bi-plus-square-fill me-2" style={{ fontSize: "20px" }}></i>
                                            Add Task
                                        </div>

                                    </td>
                                </tr>

                            </>
                        ) : (
                            <tr>
                                {
                                    loader ? (<LoaderCon />) : (
                                        <td colSpan={weeklydates.length + 2} className="text-center text-muted p-4">
                                            {loader ? (<LoaderCon />) : "No weekly data found"}
                                        </td>
                                    )
                                }

                            </tr>
                        )}
                    </tbody>

                </table>

            </Card>
            <CustomModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                handleSubmit={handleSubmit}
                validationSchema={validationSchema}
                initialValues={initialModalFields}
                formFields={formModalFields}
                modalTitle="Select Task"
            />
            <CustomModal
                show={showDetailModal}
                handleClose={() => setShowDetailModal(false)}
                handleSubmit={handleDetailSubmit}
                validationSchema={validationSchema}
                initialValues={initialModalDetailFields}
                formFields={formModalDetailFields}
                modalTitle="Description"
            />
        </>
    );
};

export default WeeklyTimeSheet;


