// --- Imports ---
import React, { Fragment, useCallback, useState, useEffect, Suspense } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import Loader from "../../components/common/loader/loader";
import Search from "../../components/common/search/Search";
import CustomForm from "../../components/custom/form/CustomForm";
import validateCustomForm from "../../components/custom/form/ValidateForm";
import useForm from "../../hooks/useForm";
import { ViewTaskField } from "../../constants/fields/taskFields";
import { deleteTaskData, editTaskData, getViewTasks } from "../../service/task_management/createTaskServices";
const CustomTable = React.lazy(() => import("../../components/custom/table/CustomTable"));
import * as Yup from "yup";
import { getEmployeeByService, getServiceByClient } from "../../service/timesheet/employeeTimeSheet";
import { getClient } from "../../service/client_management/createClientServices";
import CustomModalBox from "./model/custom/CustomModalBox";
import { TaskModalFields } from '../../constants/fields/ModelBoxFields.js';
import { getEmployee } from "../../service/employee_management/createEmployeeService.js";
import { usePermission } from "../../contexts/PermissionContext.jsx";
import { formatDateToYYYYMMDD } from "../../utils/generalUtils";
import { getUserCookie } from "../../utils/authUtils.jsx";

const ViewTask = () => {
    const [tableData, setTableData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(15);
    const [filteredData, setFilteredData] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [taskFormFields, setTaskFormFields] = useState(TaskModalFields);
    const { permissions, getOperationFlagsById } = usePermission();
    const [permissionFlags, setPermissionFlags] = useState({});
    const [formFields, setFormFields] = useState(ViewTaskField);

    const user = JSON.parse(getUserCookie("user"));
    const isAdmin = Number(user.role) === 1 || Number(user.role) === 2;
    const columns = [
        { header: "S No", accessor: "sno", editable: false },
        { header: "Employee", accessor: "assignTo", editable: false },
        { header: "Task", accessor: "task_name", editable: false },
        { header: "Fin Year", accessor: "year_name", editable: true },
        { header: "Total Time", accessor: "total_time", editable: true },
        { header: "Priority", accessor: "priority", editable: true },
        { header: "Status", accessor: "status_name", editable: true },
        { header: "Actions", accessor: "Actions", editable: false },
    ];
    const [initialModelValues, setInitialModelValues] = useState(
        TaskModalFields.reduce((values, field) => {
            values[field.name] = field.type === "dropdown" ? "" : field.type === "date" ? null : "";
            return values;
        }, {})
    );

    const validationSchema = Yup.object().shape(
        TaskModalFields.reduce((schema, field) => {
            if (field.required) {
                if (field.type === "dropdown") {
                    schema[field.name] = Yup.mixed().test(
                        'dropdown-required',
                        `${field.label} is required`,
                        value => value !== null && value !== undefined && value !== ''
                    );
                } else if (field.type === "date") {
                    schema[field.name] = Yup.date().nullable().required(`${field.label} is required`);
                } else {
                    schema[field.name] = Yup.string().required(`${field.label} is required`);
                }
            }
            return schema;
        }, {})
    );

    const { formData, errors, handleInputChange, validateForm, resetForm, setFieldValue } = useForm(
        ViewTaskField.reduce((acc, field) => {
            acc[field.name] = "";
            return acc;
        }, {}),
        (data) => validateCustomForm(data, ViewTaskField)
    );

    // ----- Fetch Data -----
    const fetchViewTaksData = async (client_id, service_id, emp_id, priority, status) => {
        try {
            const payload = { client_id, service_id, emp_id, priority, status };
            const response = await getViewTasks(payload);
            const addSno = response?.data?.data.map((data, index) => ({
                sno: index + 1,
                ...data,
                due_date: data?.due_date?.split("T")[0] || '',
                assigned_date: data?.assigned_date?.split("T")[0] || '',
                assignTo: data.assignTo.map(emp => ({
                    value: emp.emp_id,
                    label: emp.emp_name,
                    image: emp.photo
                }))
            }));
            setTableData(addSno);
            setFilteredData(addSno);
        } catch (error) {
            console.error("Fetch error:", error);
            setTableData([]);
            setFilteredData([]);
        }
    };

    useEffect(() => {
        const init = async () => {
            const flags = getOperationFlagsById(10, 2);
            setPermissionFlags(flags);

            let updatedFields = [...formFields];

            if (!isAdmin) {
                setFieldValue("employee", user.employee_id);

                // try {
                //     const res = await getEmployee();

                //     updatedFields = updatedFields.map((field) => {
                //         if (field.name === "employee") {
                //             const options = res.data.data.map((emp) => ({
                //                 value: emp.employee_id,
                //                 label: emp.name,
                //             }));
                //             return {
                //                 ...field,
                //                 options,
                //                 disable: true, // disable for non-admins
                //             };
                //         }
                //         return field;
                //     });
                //     setFormFields(updatedFields);
                // } catch (error) {
                //     console.error("Error fetching employees:", error);
                // }
            } else {
                // setFormFields(updatedFields); // For admin, just use default
            }

            fetchViewTaksData(
                "All",
                "All",
                isAdmin ? "All" : user.employee_id,
                "All",
                "ALL"
            );
        };

        init();
    }, []);

    // Fetch clients
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const res = await getClient();
                const empres = await getEmployee()
                const clients = res.data.data.map(client => ({
                    value: client.client_id,
                    label: client.client_name
                }));

                const updated = formFields.map(field => {
                    if (field.name === "client") {
                        return { ...field, options: [{ value: 'All', label: 'All' }, ...clients] };
                    }
                    if (field.name === "employee" && !isAdmin) {
                        const options = empres.data.data.map((emp) => ({
                            value: emp.employee_id,
                            label: emp.name,
                        }));
                        return {
                            ...field,
                            options,
                            disable: true,
                        };
                    }
                    return field;
                });

                setFormFields(updated);
            } catch (error) {
                console.error("Failed to fetch clients:", error);
            }
        };

        fetchClients();
    }, []);


    // Fetch services
    useEffect(() => {
        if (!formData.client) return;
        const fetchServices = async () => {
            const response = await getServiceByClient({ client_id: formData.client });
            const services = response.data.data.map(service => ({
                value: service.service_id,
                label: service.service_name
            }));
            const updated = formFields.map(field => {
                if (field.name === "service") {
                    return { ...field, options: [{ value: 'All', label: 'All' }, ...services] };
                }
                return field;
            });
            setFormFields(updated);
        };
        fetchServices();
    }, [formData.client]);

    // Fetch employee based on service
    useEffect(() => {
        if (!formData.service) return;
        const fetchEmployees = async () => {
            const payload = {
                client_id: formData.client,
                service_id: formData.service
            };
            const response = await getEmployeeByService(payload);
            const employees = response.data.data.map(emp => ({
                value: emp.employee_id,
                label: emp.name
            }));
            const updated = formFields.map(field => {
                if (field.name === "employee") {
                    return {
                        ...field,
                        options: isAdmin ? [{ value: "All", label: "All" }, ...employees] : [],
                        disable: !isAdmin
                    };
                }
                return field;
            });
            setFormFields(updated);
        };
        fetchEmployees();
    }, [formData.service]);

    // ----- Handlers -----
    const handlePageChange = (page) => setCurrentPage(page);

    const onDelete = useCallback(async (data, index) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won’t be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                const response = await deleteTaskData({ id: data.task_id });
                if (response.data.status) {
                    const newData = tableData.filter((_, i) => i !== index)
                        .map((item, i) => ({ ...item, sno: i + 1 }));
                    setTableData(newData);
                    setFilteredData(newData);
                    Swal.fire("Deleted!", "Task has been deleted.", "success");
                }
            } catch (err) {
                Swal.fire("Error", err.message || "Failed to delete task", "error");
            }
        }
    }, [tableData]);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        fetchViewTaksData(
            formData.client || '',
            formData.service || '',
            formData.employee || '',
            formData.priority || '',
            formData.status || ''
        ).catch(err =>
            Swal.fire("Error", err.message || "Failed to fetch data", "error")
        );
    };

    const updateEmployeeOptions = async () => {
        const data = await getEmployee();
        const updated = taskFormFields.map(field => {
            if (field.name === "employee") {
                return {
                    ...field,
                    options: data.data.data.map(emp => ({
                        value: emp.employee_id,
                        label: emp.name
                    }))
                };
            }
            return field;
        });
        setTaskFormFields(updated);
    };

    const handlerEdit = (data, index) => {
        updateEmployeeOptions();
        setInitialModelValues({
            taskName: data.task_name || '',
            employee: data.assignTo || [],
            service: data.service_name || '',
            client: data.client_name || '',
            assignedDate: data.assigned_date || new Date(),
            targetDate: data.due_date || '',
            priority: data.priority || '',
            status: data.status || '',
            task_id: data.task_id || ''
        });
        setShowModal(true);
    };

    const handleSubmit = async (values) => {
        try {
            const payload = {
                task_id: values.task_id,
                task_name: values.taskName,
                assignTo: values.employee.map(e => e.value),
                assignDate: formatDateToYYYYMMDD(values.assignedDate),
                dueDate: formatDateToYYYYMMDD(values.targetDate),
                priority: values.priority,
                description: '',
                status: String(values.status)
            };
            const res = await editTaskData(payload);
            if (!res.data.status) {
                return Swal.fire("Error", res.data.message || "Failed to edit task", "error");
            }
            fetchViewTaksData("All", "All", isAdmin ? "All" : user.employee_id, "All", "ALL");
            Swal.fire("Success", "Task edited successfully", "success");
            setShowModal(false);
        } catch (err) {
            Swal.fire("Error", err.message || "Failed to edit task", "error");
        }
    };

    return (
        <Fragment>
            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Body>
                            <CustomForm
                                formFields={formFields}
                                formData={formData}
                                errors={errors}
                                onChange={handleInputChange}
                                onSubmit={handleAdd}
                                btnText="Submit"
                                showAddButton={permissionFlags?.showCREATE}
                                showUpdateButton={permissionFlags?.showUPDATE}
                            />
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col xl={12}>
                    <Card className="custom-card p-3">
                        <Card.Title className="d-flex justify-content-between border-bottom pb-3">
                            <div className="w-25 px-1">
                                <Search list={tableData} onSearch={setFilteredData} />
                            </div>
                            <div className="d-flex gap-4 align-items-end">
                                <Button onClick={async () => {
                                    const { exportToExcel } = await import('../../utils/generalUtils');
                                    exportToExcel(filteredData, 'Task_List');
                                }}
                                    variant="primary"
                                    className="btn btn-wave btn-sm me-3 p-2">
                                    Export Excel
                                </Button>
                            </div>
                        </Card.Title>

                        <Card.Body className="overflow-auto">
                            <Suspense fallback={<Loader />}>
                                <CustomTable
                                    columns={columns}
                                    data={filteredData}
                                    currentPage={currentPage}
                                    recordsPerPage={recordsPerPage}
                                    totalRecords={filteredData.length}
                                    handlePageChange={handlePageChange}
                                    onDelete={onDelete}
                                    handlerEdit={handlerEdit}
                                    showDeleteButton={permissionFlags?.showDELETE}
                                    showUpdateButton={permissionFlags?.showUPDATE}
                                />
                            </Suspense>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <CustomModalBox
                show={showModal}
                handleClose={() => setShowModal(false)}
                handleSubmit={handleSubmit}
                initialValues={initialModelValues}
                validationSchema={validationSchema}
                formFields={taskFormFields}
            />
        </Fragment>
    );
};

export default ViewTask;
