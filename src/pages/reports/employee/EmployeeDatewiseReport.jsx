
import React, { Fragment, useState, useEffect, Suspense } from "react";
import { Row, Col, Card, Dropdown, Tooltip, OverlayTrigger } from "react-bootstrap";
import Swal from "sweetalert2";
import useForm from "../../../hooks/useForm";
import validateCustomForm from "../../../components/custom/form/ValidateForm";
import { getEmployeesByPermission } from "../../../service/employee_management/viewEditEmployeeService";
import Cookies from 'js-cookie';
import { usePermission } from "../../../contexts";
import DashboardCard from "../../dashboard/DashboardCard";
import { Basicpiechart } from "../piechartdata";
import { EmployeeDateWiseFields } from "../../../constants/fields/reports";
import CustomForm from "../../../components/custom/form/CustomForm";
import { getEmployeeReport, getEmployeeWeeklyReport } from '../../../service/reports/employeeReports'
import { formatDateToReadable, getISOWeekNumber } from "../../../utils/generalUtils";
import demoimage from '../../../assets/images/apps/calender.png'

import { Link } from "react-router-dom";
const EmployeeDatewiseReport = () => {
    const [formFields, setFormFields] = useState(EmployeeDateWiseFields);
    const { permissions, getOperationFlagsById } = usePermission();
    const [permissionFlags, setPermissionFlags] = useState(1);
    const [weeklyChart, setWeeklyChart] = useState({ option: [], percentages: [], option2: [] });
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
    const options = { day: '2-digit', month: 'long', year: 'numeric' };
    const [datewiseData, setDatewiseData] = useState([]);
    const initialFormState = EmployeeDateWiseFields.reduce((acc, field) => {
        acc[field.name] = "";
        return acc;
    }, {});

    const { formData, errors, handleInputChange, validateForm, resetForm, setFieldValue } = useForm(
        initialFormState,
        (data) => validateCustomForm(data, EmployeeDateWiseFields)
    );

    useEffect(() => {
        const fetchFieldOptionData = async () => {
            try {
                const userData = JSON.parse(Cookies.get('user'));
                const payload = { emp_id: userData?.employee_id };
                const employeeresponse = await getEmployeesByPermission(payload);
                const updatedFormFields = EmployeeDateWiseFields.map((field) => {
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

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        try {
            console.log("formData", formData)
            const payload = {
                "emp_id": formData?.employee || "",
                "start_date": formData?.startdate || "",
                "end_date": formData?.end || ""
            }
            const response = await getEmployeeReport(payload)
            if (!response.data.status) {
                return Swal.fire("Error", response.data.message || "Failed to get worksheet.", "error");
            }
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

            setDatewiseData(response.data.data);

            const client_name = response.data.data.map((item) => item.client_name);
            const times = response.data.data.map((item) => item.total_time);
            setWeeklyChart((prev) => ({
                ...prev,
                option: client_name,
                percentages: times
                // option2:
            }))
            console.log("Response : ", response, client_name, times)
        } catch (err) {
            Swal.fire("Error", err.response?.data?.message || "Failed to get client timesheet data.", "error");
        }
    };

    const handlerOnTaskStatusChange = (e) => {
       console.log("Task Status Changed", e.target.value);
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
                }

                {
                    <>
                        <Col xl={6}>
                            <Card className="custom-card p-3">
                                <Card.Body className="overflow-auto">
                                    {weeklyChart.option.length > 0 ? (
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
                            <div className="row">
                                <Col xxl={12} xl={12} md={12}>
                                    <Card className="custom-card overflow-hidden">
                                        <Card.Header className="justify-content-between">
                                            <h6 className="card-title">Task Details</h6>
                                            <Dropdown>
                                                <Dropdown.Toggle variant='' className="btn-outline-light btn btn-sm text-muted no-caret" data-bs-toggle="dropdown" aria-expanded="false">
                                                    View All<i className="ri-arrow-down-s-line align-middle ms-1"></i>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu as="ul" role="menu">
                                                    <Dropdown.Item as="li" value={0} onClick={handlerOnTaskStatusChange}>Pending</Dropdown.Item>
                                                    <Dropdown.Item as="li" value={1} onClick={handlerOnTaskStatusChange}>In Progress</Dropdown.Item>
                                                    <Dropdown.Item value={2} onClick={handlerOnTaskStatusChange}>Completed</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                        </Card.Header>
                                        <Card.Body style={{ height: '500px', overflowY: 'auto' }}>
                                            <ul className="list-unstyled mb-0">
                                                {
                                                    datewiseData.map((item, index) => (
                                                        <li className="mb-4" key={index}>
                                                            <div className="d-flex align-items-center gap-2"
                                                                style={{ background: '#8080800d', padding: '.8rem 1rem', borderRadius: '10px' }}>
                                                                <OverlayTrigger key={index} placement="top" overlay={<Tooltip>{item.client_name}</Tooltip>}>
                                                                    <span
                                                                        className="avatar avatar-sm avatar-rounded"
                                                                        style={{ width: "30px", height: "30px" }}>
                                                                        <img src={item.client_photo || demoimage} alt={"img"} />
                                                                    </span>
                                                                </OverlayTrigger>
                                                                <div className="flex-1 flex-between pos-relative">
                                                                    <div className="d-flex flex-column">
                                                                        <span className="fs-14 fw-semibold">{item.task_name}</span>
                                                                        <span className="tx-inverse fs-11 text-muted mb-0">{formatDateToReadable(item.created_at)}</span>
                                                                    </div>
                                                                    <div>
                                                                    </div>                                                                    <div className="min-w-fit-content text-end">
                                                                        <span className={`badge badge-sm bg-${item.status === "0" ? 'danger' : item.status === "1" ? 'secondary' : 'success'}-transparent rounded-pill`}>
                                                                            {item.task_status}
                                                                        </span>

                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div className="mx-2 mt-1">
                                                                <span className="tx-inverse  text-muted mb-0">{item.description}</span>
                                                            </div>
                                                        </li>
                                                    ))
                                                }
                                            </ul>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </div>
                        </Col>
                    </>
                }

            </Row>
        </Fragment >
    );
};

export default EmployeeDatewiseReport;
