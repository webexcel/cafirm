
import React, { Fragment, useState, useEffect, Suspense } from "react";
import { Row, Col, Card } from "react-bootstrap";
import Swal from "sweetalert2";
import useForm from "../../../hooks/useForm";
import validateCustomForm from "../../../components/custom/form/ValidateForm";
import { usePermission } from "../../../contexts";
import DashboardCard from "../../dashboard/DashboardCard";
import { Basicpiechart } from "../piechartdata";
import CustomForm from "../../../components/custom/form/CustomForm";
import { ClientWeeklyFields } from "../../../constants/fields/reports";
import { getClient } from "../../../service/client_management/createClientServices";
import { getClientWeeklyReport } from "../../../service/reports/employeeReports";
const ClientWeeklyReport = () => {
    const [formFields, setFormFields] = useState(ClientWeeklyFields);
    const { permissions, getOperationFlagsById } = usePermission();
    const [permissionFlags, setPermissionFlags] = useState(1);
    const [weeklyChart, setWeeklyChart] = useState({ option: [], percentages: [] });
    const initialFormState = ClientWeeklyFields.reduce((acc, field) => {
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
      

    const { formData, errors, handleInputChange, validateForm } = useForm(
        initialFormState,
        (data) => validateCustomForm(data, ClientWeeklyFields)
    );

    useEffect(() => {
        const fetchFieldOptionData = async () => {
            try {
                const clientresponse = await getClient();
                const updatedFormFields = ClientWeeklyFields.map((field) => {
                    if (field.name === "client") {
                        if (Array.isArray(clientresponse.data.data) && clientresponse.data.data.length > 0) {
                            const clientOptions = clientresponse.data.data.map((item) => ({
                                value: item.client_id,
                                label: item.client_name,
                            }));
                            return {
                                ...field,
                                options: clientOptions,
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
                "client_id": formData?.client,
                "id": week,
                "year": year
            }
            const response = await getClientWeeklyReport(payload)
            if (!response.data.status) {
                return Swal.fire("Error", response.data.message || "Failed to get weekly client dataa.", "error");
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
              

            const task_name = response.data.data.map((item) => item.task_name);
            const times = response.data.data.map((item) => item.total_time);
            setWeeklyChart((prev) => ({
                ...prev,
                option: task_name,
                percentages: times
            }))
        } catch (err) {
            Swal.fire("Error", err.response?.data?.message || "Failed to get weekly client dataa.", "error");
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
                    // submitState && (
                    <>
                        <Col xl={12}>
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
                    </>
                    // )
                }

            </Row>
        </Fragment >
    );
};

export default ClientWeeklyReport;
