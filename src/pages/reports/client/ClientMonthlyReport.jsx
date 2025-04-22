
import React, { Fragment, useState, useEffect, Suspense } from "react";
import { Row, Col, Card } from "react-bootstrap";
import Swal from "sweetalert2";
import useForm from "../../../hooks/useForm";
import validateCustomForm from "../../../components/custom/form/ValidateForm";
import { usePermission } from "../../../contexts";
import DashboardCard from "../../dashboard/DashboardCard";
import { Distributed } from "../columnchartdata";
import CustomForm from "../../../components/custom/form/CustomForm";
import { ClientMonthlyFields } from "../../../constants/fields/reports";
import { getClientMonthlyReport, getEmployeeMonthlyReport } from "../../../service/reports/employeeReports";
import { getClient } from "../../../service/client_management/createClientServices";
const EmployeeMonthlyReport = () => {
    const [formFields, setFormFields] = useState(ClientMonthlyFields);
    const { permissions, getOperationFlagsById } = usePermission();
    const [permissionFlags, setPermissionFlags] = useState(1);
    const [monthlyChart, setMonthlyChart] = useState({ task: [], time: [] });
    const initialFormState = ClientMonthlyFields.reduce((acc, field) => {
        acc[field.name] = "";
        return acc;
    }, {});
    const [allCount, setAllCount] = useState([
        { label: "Total Task", value: 0 },
        { label: "Pending", value: 0 },
        { label: "In Progress", value: 0 },
        { label: "Completed", value: 0 },
    ])

    const { formData, errors, handleInputChange, validateForm, resetForm, setFieldValue } = useForm(
        initialFormState,
        (data) => validateCustomForm(data, ClientMonthlyFields)
    );

    useEffect(() => {
        const fetchFieldOptionData = async () => {
            try {
                const clientresponse = await getClient();
                const updatedFormFields = ClientMonthlyFields.map((field) => {
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
        if (!(formData?.monthly_id instanceof Date) || isNaN(formData?.monthly_id)) {
            return Swal.fire("Error", "Invalid date selected.", "error");
        }
        try {
            console.log("formData: ", formData);

            const month = formData?.monthly_id?.getMonth() + 1;
            const year = formData?.monthly_id?.getFullYear();

            const payload = {
                "client_id": formData?.client,
                "month": month,
                "year": year
            };

            console.log("Payload being sent:", payload);

            const response = await getClientMonthlyReport(payload);

            if (!response.data?.status) {
                return Swal.fire("Error", response.data?.message || "Failed to get monthly employee data.", "error");
            }

            console.log("API response:", response);

            setAllCount([
                { label: 'Total Task', value: response?.data?.count?.total_tasks || 0 },
                { label: 'Pending', value: response?.data?.count?.pending || 0 },
                { label: 'In Progress', value: response?.data?.count?.inprocess || 0 },
                { label: 'Completed', value: response?.data?.count?.completed || 0 }
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
                                        Icon={'fe fe-user-plus'}
                                        Color={'bg-teal-transparent text-teal'}
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
