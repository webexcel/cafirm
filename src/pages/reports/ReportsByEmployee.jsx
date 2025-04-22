import React, { Fragment, useState, useEffect, Suspense } from "react";
import { Row, Col, Card } from "react-bootstrap";
import Swal from "sweetalert2";
import CustomForm from "../../components/custom/form/CustomForm";
import Loader from "../../components/common/loader/loader";
import useForm from "../../hooks/useForm";
import validateCustomForm from "../../components/custom/form/ValidateForm";
const CustomTable = React.lazy(() => import("../../components/custom/table/CustomTable"));
import { getAttendanceByDate } from "../../service/attendance/activityTracker";
import { getEmployeesByPermission } from "../../service/employee_management/viewEditEmployeeService";
import Cookies from 'js-cookie';
import { usePermission } from "../../contexts";
import { ReportFields } from "../../constants/fields/reports";
import DashboardCard from "../dashboard/DashboardCard";
import { Basicarea } from "./areachartdata";
import { Basicpiechart } from "./piechartdata";
import { Basicline } from "./linechartdata";
import { getClients, getMonthlyReport, getWeeklyReport, getYearlyReport } from "../../service/reports/employeeReports";
import { Distributed } from "./columnchartdata";
import DatePicker from "react-datepicker";
const ReportsByEmployee = () => {
    const [formFields, setFormFields] = useState(ReportFields);
    const { permissions, getOperationFlagsById } = usePermission();
    const [permissionFlags, setPermissionFlags] = useState(1);
    const [chartData, setChartData] = useState({ months: [], monthData: [] });
    const [monthlyChart, setMonthlyChart] = useState({ task: [], time: [] });
    const [weeklyChart, setWeeklyChart] = useState({ client_name: [], percentages: [] });
    const [selectedYear, setSelectedYear] = useState(() => {
        const currentYear = new Date().getFullYear();
        return currentYear;
    });
    const [selectedWeeklyYear, setSelectedWeeklyYear] = useState(() => {
        const currentYear = new Date().getFullYear();
        return currentYear;
    })
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const initialFormState = ReportFields.reduce((acc, field) => {
        acc[field.name] = "";
        return acc;
    }, {});
    const [submitState, setSubmitState] = useState(false)

    const { formData, errors, handleInputChange, validateForm, resetForm, setFieldValue } = useForm(
        initialFormState,
        (data) => validateCustomForm(data, ReportFields)
    );

    useEffect(() => {
        const fetchFieldOptionData = async () => {
            try {
                const userData = JSON.parse(Cookies.get('user'));
                const payload = { emp_id: userData?.employee_id };
                const employeeresponse = await getEmployeesByPermission(payload);
                const updatedFormFields = ReportFields.map((field) => {
                    if (field.name === "employee") {
                        if (Array.isArray(employeeresponse.data.data) && employeeresponse.data.data.length > 0) {
                            if (employeeresponse.data.data.length === 1) {
                                setFieldValue("employee", employeeresponse.data.data[0].employee_id);
                            }
                            const employeeOptions = employeeresponse.data.data.map((item) => ({
                                value: item.employee_id,
                                label: item.name,
                            }));
                            return {
                                ...field,
                                options: employeeOptions,
                                disabled: employeeresponse.data.data.length === 1
                            };
                        }
                    }
                    return field;
                });
                setFormFields(updatedFormFields);
            } catch (error) {
                console.error("Error fetching class data:", error);
            }
        };
        fetchFieldOptionData();
        const permissionFlags = getOperationFlagsById(19, 2);
        setPermissionFlags(permissionFlags);
    }, []);

    useEffect(() => {
        const getAllClients = async () => {
            if (!formData.employee) return;
            try {
                const payload = { emp_id: formData.employee };
                const response = await getClients(payload);
                if (!Array.isArray(response.data.data)) return;
                const clientOptions = response.data.data.map((item) => ({
                    value: item.client_id,
                    label: item.client_name,
                }));
                setFormFields((prevFields) =>
                    prevFields.map((field) =>
                        field.name === "client_id" ? { ...field, options: clientOptions } : field
                    )
                );
            } catch (error) {
                console.log("Error getting client data:", error);
            }
        };
        getAllClients();
    }, [formData.employee]);

    useEffect(() => {
        const getMontlyChartData = async () => {
            if (!formData.client_id) {
                setMonthlyChart({ task: [], time: [] });
                return;
            }
            try {
                const today = new Date();
                const currentMonth = today.getMonth() + 1;
                const currentYear = today.getFullYear();
                const payload = {
                    emp_id: formData?.employee,
                    client_id: formData?.client_id,
                    month: currentMonth,
                    year: currentYear
                };
                const response = await getMonthlyReport(payload);
                const tasks = response.data.data.map((item) => item.task_name);
                const times = response.data.data.map((item) => String(item.total_hours).split('.')[0]);
                setMonthlyChart({ task: tasks, time: times });
                console.log("monthlyCharteee", monthlyChart, tasks, times)
            } catch (error) {
                console.log("Error getting monthly data:", error);
            }
        };
        getMontlyChartData();
    }, [formData.client_id]);

    useEffect(() => {
        const getEmployeeYearData = async () => {
            try {
                const userData = JSON.parse(Cookies.get('user'));
                const payload = {
                    emp_id: userData?.employee_id || '',
                    year: selectedYear
                };
                const response = await getYearlyReport(payload);
                const months = response.data.data.task_count_per_month.map((m) => m.month);
                const monthdata = response.data.data.task_count_per_month.map((m) => m.count);
                setChartData({ months, monthData: monthdata });
            } catch (error) {
                console.log("Error getting yearly employee data:", error);
            }
        };
        console.log("selectedYearselectedYearselectedYearselectedYear", selectedYear)
        getEmployeeYearData();
    }, [selectedYear]);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            setSubmitState(true)
            // if (!response.data.status) {
            //     return Swal.fire("Error", response.data.message || "Failed to get worksheet.", "error");
            // }
        } catch (err) {
            Swal.fire("Error", err.response?.data?.message || "Failed to get client timesheet data.", "error");
        }
    };

    const getWeeklyDate = async (emp_id, client_id, week_start, week_end) => {
        const payload = {
            "emp_id": emp_id,
            "client_id": client_id,
            "week_start": week_start,
            "week_end": week_end,
        }
        const response = await getWeeklyReport(payload)
        const client_name = response.data?.data.map((item) => item.client_name)
        const percentages = response.data?.data.map((item) => item.percentage)
        setWeeklyChart({ client_name: client_name, percentages: percentages })
        console.log("Weekly Response :", response)
    }

    const handleChange = (dates) => {
        const [start, end] = dates;
        if (start) {
            const newEndDate = new Date(start);
            newEndDate.setDate(start.getDate() + 6);
            setDateRange([start, newEndDate]);
            console.log("dateeeee checkk : ", start, end)
            const startDate = new Date(start).toISOString().split('T')[0]
            const endDate = new Date(end).toISOString().split('T')[0]
            console.log("formDataformData", formData)
            getWeeklyDate(formData.employee, formData.client_id, "2025-04-01", "2025-04-07")
        } else {
            setDateRange([null, null]);
        }
    };

    useEffect(() => {
        if (formData.client_id) {
            function getWeeklyDateRange(date = new Date()) {
                const today = new Date(date);
                const dayOfWeek = today.getDay();
                const lastSunday = new Date(today);
                lastSunday.setDate(today.getDate() - dayOfWeek);
                const nextSaturday = new Date(lastSunday);
                nextSaturday.setDate(lastSunday.getDate() + 6);
                const formattedLastSunday = lastSunday.toISOString().split('T')[0];
                const formattedNextSaturday = nextSaturday.toISOString().split('T')[0];
                return {
                    lastSunday: formattedLastSunday,
                    nextSaturday: formattedNextSaturday
                };
            }
            const { lastSunday, nextSaturday } = getWeeklyDateRange();
            setDateRange([lastSunday, nextSaturday]);
            const currentYear = new Date().getFullYear();
            getWeeklyDate(formData.employee, formData.client_id, lastSunday, nextSaturday)
        }
    }, [formData?.client_id]);

    const getSelectedMonthly = async (date) => {
        try {
            const selectedMonth = new Date(date).getMonth() + 1
            const selectedYear = new Date(date).getFullYear()
            const payload = {
                emp_id: formData?.employee,
                client_id: formData?.client_id,
                month: selectedMonth,
                year: selectedYear
            };
            const response = await getMonthlyReport(payload);
            const tasks = response.data.data.map((item) => item.task_name);
            const times = response.data.data.map((item) => String(item.total_hours).split('.')[0]);
            setMonthlyChart({ task: tasks, time: times });
            console.log("monthlyCharteee", monthlyChart, tasks, times)
        } catch (error) {
            console.log("Error getting monthly data:", error);
        }
        const selectDate = new Date(date).getMonth()
        console.log("Dateeee", selectDate + 1, date)
        setSelectedMonth(date)

    }
    return (
        <Fragment>
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
                                    showAddButton={permissionFlags?.showCREATE}
                                    showUpdateButton={permissionFlags?.showUPDATE}
                                />
                            </Col>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                {
                    submitState && (
                        <Col xl={12}>
                            <Row>
                                {[
                                    { count: 10, name: 'Task Count' },
                                    { count: 5, name: 'Pending' },
                                    { count: 3, name: 'In Progress' },
                                    { count: 2, name: 'Completed' }
                                ].map((item, idx) => (
                                    <Col md={3} key={idx} className="card-background flex-fill">
                                        <DashboardCard
                                            Title={item.name}
                                            Count={item.count}
                                            Icon={'fe fe-user-plus'}
                                            Color={'bg-teal-transparent text-teal'}
                                        />
                                    </Col>
                                ))}

                            </Row>
                        </Col>
                    )
                }

                {
                    submitState && (
                        <>
                            <Col xl={12}>
                                <Card className="custom-card p-3">
                                    <Card.Header className="p-0 pb-3 pt-2">
                                        <div className="fw-bold fs-15" style={{ color: 'gray' }}>Employee Yearly Performance</div>
                                        <DatePicker
                                            selected={new Date(selectedYear, 0)}
                                            onChange={(date) => setSelectedYear(date.getFullYear())}
                                            showYearPicker
                                            dateFormat="yyyy"
                                            className="form-control"
                                            placeholderText="Select Year"
                                        />


                                    </Card.Header>
                                    <Card.Body className="overflow-auto px-0">

                                        {chartData.monthData.length > 0 ? (
                                            <div id="line-chart">
                                                <Basicline chartData={chartData} />
                                            </div>
                                        ) : (
                                            <div className="fs-16 fw-semibold d-flex justify-content-center">No Data Found!</div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col xl={6}>
                                <Card className="custom-card p-3">
                                    <Card.Header className="p-0 pb-3 pt-2">
                                        <div className="fw-bold fs-14" style={{ color: 'gray' }}>Employee Weekly Performance</div>

                                        <div>
                                            <DatePicker
                                                selectsRange
                                                startDate={startDate}
                                                endDate={endDate}
                                                onChange={handleChange}
                                                isClearable
                                                placeholderText="Select a start date"
                                                className="form-control"
                                                minDate={startDate}
                                            />
                                        </div>
                                    </Card.Header>
                                    <Card.Body className="overflow-auto">
                                        {weeklyChart.client_name.length > 0 ? (
                                            <div id="pie-basic">
                                                <Basicpiechart weeklyChart={weeklyChart} />
                                            </div>
                                        ) : (
                                            <div className="fs-16 fw-semibold d-flex justify-content-center">No Data Found!</div>
                                        )}

                                    </Card.Body>
                                </Card>
                            </Col>

                            <Col xl={6}>
                                <Card className="custom-card p-3">
                                    <Card.Header className="p-0 pb-3 pt-2">
                                        <div className="fw-bold fs-14" style={{ color: 'gray' }}>Employee monthly Performance</div>

                                        <DatePicker
                                            selected={selectedMonth}
                                            onChange={(date) => getSelectedMonthly(date)}
                                            showMonthYearPicker
                                            dateFormat="MM/yyyy"
                                            className="form-control"
                                            placeholderText="Select Month"
                                        />
                                    </Card.Header>
                                    <Card.Body className="overflow-auto p-0">
                                        {monthlyChart.task.length > 0 ? (
                                            <div id="columns-distributed">
                                                <Distributed monthlyChart={monthlyChart} />
                                            </div>
                                        ) : (
                                            <div className="fs-16 fw-semibold d-flex justify-content-center">No Data Found!</div>
                                        )}
                                    </Card.Body>
                                </Card>
                            </Col>
                        </>
                    )
                }

            </Row>
        </Fragment >
    );
};

export default ReportsByEmployee;
