
import React, { Fragment, useState, useEffect, Suspense } from "react";
import { Row, Col, Card } from "react-bootstrap";
import Swal from "sweetalert2";
import useForm from "../../../hooks/useForm";
import validateCustomForm from "../../../components/custom/form/ValidateForm";
import { getEmployeesByPermission } from "../../../service/employee_management/viewEditEmployeeService";
import Cookies from 'js-cookie';
import { usePermission } from "../../../contexts";
import DashboardCard from "../../dashboard/DashboardCard";
import { Distributed } from "../columnchartdata";
import CustomForm from "../../../components/custom/form/CustomForm";
import { EmployeeMonthlyFields } from "../../../constants/fields/reports";
import { getClientMonthlyReport, getEmployeeMonthlyReport } from "../../../service/reports/employeeReports";
const EmployeeMonthlyReport = () => {
    const [formFields, setFormFields] = useState(EmployeeMonthlyFields);
    const { permissions, getOperationFlagsById } = usePermission();
    const [permissionFlags, setPermissionFlags] = useState(1);
    const [monthlyChart, setMonthlyChart] = useState({ task: [], time: [] });
    const initialFormState = EmployeeMonthlyFields.reduce((acc, field) => {
        acc[field.name] = "";
        return acc;
    }, {});
    const [allCount, setAllCount] = useState([
        {
            label: "Total Task",
            value: 0,
            icon: "bi-card-checklist",
            color: "bg-primary-transparent"
        },
        {
            label: "Pending",
            value: 0,
            icon: "bi-hourglass-split",
            color: "bg-warning-transparent"
        },
        {
            label: "In Progress",
            value: 0,
            icon: "bi-arrow-repeat",
            color: "bg-info-transparent"
        },
        {
            label: "Completed",
            value: 0,
            icon: "bi-check2-circle",
            color: "bg-success-transparent"
        }
    ]);

    const { formData, errors, handleInputChange, validateForm, resetForm, setFieldValue } = useForm(
        initialFormState,
        (data) => validateCustomForm(data, EmployeeMonthlyFields)
    );

    useEffect(() => {
        const fetchFieldOptionData = async () => {
            try {
                const userData = JSON.parse(Cookies.get('user'));
                const payload = { emp_id: userData?.employee_id };
                const employeeresponse = await getEmployeesByPermission(payload);
                const updatedFormFields = EmployeeMonthlyFields.map((field) => {
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


    const handleAdd = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        if (!(formData?.monthly_id instanceof Date) || isNaN(formData?.monthly_id)) {
            return Swal.fire("Error", "Invalid date selected.", "error");
        }

        try {
            console.log("formData: ", formData);

            const month = formData?.monthly_id?.getMonth() + 1;
            const year = formData?.monthly_id?.getFullYear();

            const payload = {
                emp_id: formData?.employee,
                month: month,
                year: year
            };

            console.log("Payload being sent:", payload);

            const response = await getEmployeeMonthlyReport(payload);

            if (!response.data?.status) {
                return Swal.fire("Error", response.data?.message || "Failed to get monthly employee data.", "error");
            }
            const task_id = response.data.data.map((item) => item.client_name);
            const times = response.data.data.map((item) => item.total_minutes);

            setMonthlyChart((prev) => ({
                ...prev,
                task : task_id,
                time : times
            }))
            console.log("API response:", response);

            setAllCount([
                {
                    label: 'Total Task',
                    value: response?.data?.count?.total_tasks || 0,
                    icon: "bi-card-checklist",
                    color: "bg-primary-transparent"
                },
                {
                    label: 'Pending',
                    value: response?.data?.count?.pending || 0,
                    icon: "bi-hourglass-split",
                    color: "bg-warning-transparent"
                },
                {
                    label: 'In Progress',
                    value: response?.data?.count?.inprocess || 0,
                    icon: "bi-arrow-repeat",
                    color: "bg-info-transparent"
                },
                {
                    label: 'Completed',
                    value: response?.data?.count?.completed || 0,
                    icon: "bi-check2-circle",
                    color: "bg-success-transparent"
                }
            ]);

        } catch (err) {
            console.error("API Error: ", err);
            Swal.fire("Error", err.response?.data?.message || "Failed to get monthly employee data.", "error");
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
                    // submitState && (
                    <Col xl={12}>
                        <Row>
                            {allCount.map((item, idx) => (
                                <Col md={3} key={idx} className="card-background flex-fill">
                                    <DashboardCard
                                        Title={item.label}
                                        Count={item.value}
                                        Icon={item.icon}
                                        Color={item.color}
                                    />
                                </Col>
                            ))}

                        </Row>
                    </Col>
                    // )
                }

                {
                    <>
                        <Col xl={12}>
                            <Card className="custom-card p-3">
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
                }

            </Row>
        </Fragment >
    );
};

export default EmployeeMonthlyReport;
