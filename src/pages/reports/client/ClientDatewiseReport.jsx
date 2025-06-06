
import React, { Fragment, useState, useEffect, Suspense } from "react";
import { Row, Col, Card, Dropdown, OverlayTrigger, Tooltip } from "react-bootstrap";
import Swal from "sweetalert2";
import useForm from "../../../hooks/useForm";
import validateCustomForm from "../../../components/custom/form/ValidateForm";
import { usePermission } from "../../../contexts";
import DashboardCard from "../../dashboard/DashboardCard";
import { Basicpiechart } from "../piechartdata";
import CustomForm from "../../../components/custom/form/CustomForm";
import { ClientDateWiseFields } from "../../../constants/fields/reports";
import { getClient } from "../../../service/client_management/createClientServices";
import { getClientReport, getClientWeeklyReport } from "../../../service/reports/employeeReports";
import { formatDateToReadable } from "../../../utils/generalUtils";
import demoimage from '../../../assets/images/apps/calender.png'

const ClientDatewiseReport = () => {
    const [formFields, setFormFields] = useState(ClientDateWiseFields);
    const { permissions, getOperationFlagsById } = usePermission();
    const [permissionFlags, setPermissionFlags] = useState(1);
    const [datewiseData, setDatewiseData] = useState([]);
    const [weeklyChart, setWeeklyChart] = useState({ option: [], percentages: [] });
    const [selectedLabel, setSelectedLabel] = useState("View All");
    const [initialDatewiseData, setInitialDatewiseData] = useState([]);
    const initialFormState = ClientDateWiseFields.reduce((acc, field) => {
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
        (data) => validateCustomForm(data, ClientDateWiseFields)
    );

    useEffect(() => {
        const fetchFieldOptionData = async () => {
            try {
                const clientresponse = await getClient();
                const updatedFormFields = ClientDateWiseFields.map((field) => {
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
            console.log("formData", formData)
            const payload = {
                "client_id": formData?.client || "",
                "start_date": formData?.startdate || "",
                "end_date": formData?.end || ""
            }
            const response = await getClientReport(payload)
            if (!response.data.status) {
                return Swal.fire("Error", response.data.message || "Failed to get date wise client dataa.", "error");
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
            setInitialDatewiseData(response.data.data);
            console.log("Datewise Data", response.data.data);
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



    const handlerOnTaskStatusChange = (e) => {
        const value = e.target.getAttribute("value"); // safer for <Dropdown.Item>
        const statusLabels = {
            "0": "Pending",
            "1": "In Progress",
            "2": "Completed",
            "3": "View All"
        };

        setSelectedLabel(statusLabels[value] || "View All");

        if (value === "3") {
            setDatewiseData(initialDatewiseData);
        } else {
            const filteredData = initialDatewiseData.filter(item => item.status === value);
            setDatewiseData(filteredData);
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
                                                    {selectedLabel}<i className="ri-arrow-down-s-line align-middle ms-1"></i>
                                                </Dropdown.Toggle>
                                                <Dropdown.Menu as="ul" role="menu">
                                                    <Dropdown.Item as="li" value={3} onClick={handlerOnTaskStatusChange}>All</Dropdown.Item>
                                                    <Dropdown.Item as="li" value={0} onClick={handlerOnTaskStatusChange}>Pending</Dropdown.Item>
                                                    <Dropdown.Item as="li" value={1} onClick={handlerOnTaskStatusChange}>In Progress</Dropdown.Item>
                                                    <Dropdown.Item as="li" value={2} onClick={handlerOnTaskStatusChange}>Completed</Dropdown.Item>
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
                                                                    </div>
                                                                    <div className="min-w-fit-content text-end">
                                                                        <span className={`badge badge-sm bg-${item.status === "0" ? 'danger' : item.status === "1" ? 'secondary' : 'success'}-transparent rounded-pill`}>
                                                                            {item.task_status}
                                                                        </span>
                                                                        <div className="avatar-list-stacked mt-2">
                                                                            {item?.assigned_employees?.map((data, index) => (
                                                                                <OverlayTrigger key={index} placement="top" overlay={<Tooltip>{data.name}</Tooltip>}>
                                                                                    <span
                                                                                        className="avatar avatar-sm avatar-rounded"
                                                                                        style={{ width: "30px", height: "30px" }}>
                                                                                        <img src={data.photo || demoimage} alt={data.image || "img"} />
                                                                                    </span>
                                                                                </OverlayTrigger>
                                                                            ))}
                                                                        </div>
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
                    // )
                }

            </Row >
        </Fragment >
    );
};

export default ClientDatewiseReport;
