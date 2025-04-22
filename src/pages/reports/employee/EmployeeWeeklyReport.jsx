
import React, { Fragment, useState, useEffect, Suspense } from "react";
import { Row, Col, Card } from "react-bootstrap";
import Swal from "sweetalert2";
import useForm from "../../../hooks/useForm";
import validateCustomForm from "../../../components/custom/form/ValidateForm";
import { getEmployeesByPermission } from "../../../service/employee_management/viewEditEmployeeService";
import Cookies from 'js-cookie';
import { usePermission } from "../../../contexts";
import DashboardCard from "../../dashboard/DashboardCard";
import { Basicpiechart } from "../piechartdata";
import { EmployeeWeeklyFields } from "../../../constants/fields/reports";
import CustomForm from "../../../components/custom/form/CustomForm";
import { getEmployeeWeeklyReport } from '../../../service/reports/employeeReports'
const EmployeeWeeklyReport = () => {
    const [formFields, setFormFields] = useState(EmployeeWeeklyFields);
    const { permissions, getOperationFlagsById } = usePermission();
    const [permissionFlags, setPermissionFlags] = useState(1);
    const [weeklyChart, setWeeklyChart] = useState({ client_name: [], percentages: [] });
    const [allCount, setAllCount] = useState([
        { label: "Total Task", value: 0 },
        { label: "Pending", value: 0 },
        { label: "In Progress", value: 0 },
        { label: "Completed", value: 0 },
    ])
    const initialFormState = EmployeeWeeklyFields.reduce((acc, field) => {
        acc[field.name] = "";
        return acc;
    }, {});

    const { formData, errors, handleInputChange, validateForm, resetForm, setFieldValue } = useForm(
        initialFormState,
        (data) => validateCustomForm(data, EmployeeWeeklyFields)
    );

    useEffect(() => {
        const fetchFieldOptionData = async () => {
            try {
                const userData = JSON.parse(Cookies.get('user'));
                const payload = { emp_id: userData?.employee_id };
                const employeeresponse = await getEmployeesByPermission(payload);
                const updatedFormFields = EmployeeWeeklyFields.map((field) => {
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

                    if (field.name === "weekly_id") {
                        const getCurrentWeek = () => {
                            const today = new Date();
                            const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
                            const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
                            return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
                        };
                        const currentWeek = getCurrentWeek();
                        const weekList = Array.from({ length: currentWeek }, (_, i) => ({
                            label: `Week ${i + 1}`,
                            value: `${i + 1}`
                        }));

                        if (Array.isArray(weekList) && weekList.length > 0) {
                            return {
                                ...field,
                                options: weekList,
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

    }, [])

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            console.log("formData", formData.weekly_id)
            const date = formData.weekly_id;
            const getWeekNumber = (date) => {
                const firstJan = new Date(date.getFullYear(), 0, 1);
                const days = Math.floor((date - firstJan) / (24 * 60 * 60 * 1000));
                return Math.ceil((date.getDay() + 1 + days) / 7);
            };
            const week = getWeekNumber(date);
            const year = date.getFullYear();
            console.log("Selected Week:", week);
            console.log("Selected Year:", year);
            const payload = {
                "emp_id": formData?.employee,
                "id": week,
                "year": year
            }
            const response = await getEmployeeWeeklyReport(payload)
            if (!response.data.status) {
                return Swal.fire("Error", response.data.message || "Failed to get worksheet.", "error");
            }
            setAllCount([
                { label: 'Total Task', value: response?.data?.count?.total_tasks || 0 },
                { label: 'Pending', value: response?.data?.count?.pending || 0 },
                { label: 'In Progress', value: response?.data?.count?.inprocess || 0 },
                { label: 'Completed', value: response?.data?.count?.completed || 0 }
            ]);

            const client_name = response.data.data.map((item) => item.client_name);
            const times = response.data.data.map((item) => item.total_time);
            setWeeklyChart((prev) => ({
                ...prev,
                client_name: client_name,
                percentages: times
            }))
            console.log("Response : ", response, client_name, times)
        } catch (err) {
            Swal.fire("Error", err.response?.data?.message || "Failed to get client timesheet data.", "error");
        }
    };

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
                    <Col xl={12}>
                        <Row>
                            {allCount.map((item, idx) => (
                                <Col md={3} key={idx} className="card-background flex-fill">
                                    <DashboardCard
                                        Title={item.label}
                                        Count={item.value}
                                        Icon={'fe fe-user-plus'}
                                        Color={'bg-teal-transparent text-teal'}
                                    />
                                </Col>
                            ))}

                        </Row>
                    </Col>
                }

                {
                    <>
                        <Col xl={12}>
                            <Card className="custom-card p-3">
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
                    </>
                }

            </Row>
        </Fragment >
    );
};

export default EmployeeWeeklyReport;
