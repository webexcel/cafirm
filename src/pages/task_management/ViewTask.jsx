
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
const CustomTable = React.lazy(() =>
    import("../../components/custom/table/CustomTable")
);
import * as Yup from "yup";
import { getEmployeeByService, getServiceByClient } from "../../service/timesheet/employeeTimeSheet";
import { getClient } from "../../service/client_management/createClientServices";
import sampledata from '../../../sampledata.json'
import CustomModalBox from "./model/custom/CustomModalBox";
import { TaskModalFields } from '../../constants/fields/ModelBoxFields.js'
import { getEmployee } from "../../service/employee_management/createEmployeeService.js";

const ViewTask = () => {

    const [tableData, setTableData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(15);
    const [filteredData, setFilteredData] = useState(tableData);
    const [showModal, setShowModal] = useState(false);
    const [taskFormFileds, setTaskFormFields] = useState(TaskModalFields)
    const [initialModelValues, setInitialModelValues] = useState(
        TaskModalFields.reduce((values, field) => {
            values[field.name] = field.type === "dropdown" ? "" : field.type === "date" ? null : "";
            return values;
        }, {})
    );

    const columns = [
        { header: "S No", accessor: "sno", editable: false },
        { header: "Client", accessor: "client_name", editable: false },
        { header: "Employee", accessor: "assignTo", editable: false },
        { header: "Task", accessor: "task_name", editable: false },
        { header: "Service", accessor: "service_name", editable: true },
        { header: "Priority", accessor: "priority", editable: true },
        { header: "Status", accessor: "status_name", editable: true },
        { header: "Actions", accessor: "Actions", editable: false },
    ];
    const [formFields, setFormFields] = useState(ViewTaskField);

    const initialFormState = ViewTaskField.reduce((acc, field) => {
        acc[field.name] = "";
        return acc;
    }, {});

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

    const { formData, errors, handleInputChange, validateForm, resetForm } = useForm(
        initialFormState,
        (data) => validateCustomForm(data, ViewTaskField)
    );

    const fetchViewTaksData = async (client_id, service_id, emp_id, priority, status) => {
        try {
            const payload = {
                "client_id": client_id,
                "service_id": service_id,
                "emp_id": emp_id,
                "priority": priority,
                "status": status
            }
            const response = await getViewTasks(payload)
            const addSno = response?.data?.data.map((data, index) => ({
                sno: index + 1,
                ...data,
                due_date: String(data.due_date)?.split('T')[0] || '',
                assigned_date: String(data?.assigned_date).split('T')[0] || '',
                assignTo: data.assignTo.map((empdata) => ({ value: empdata.emp_id, label: empdata.emp_name }))
            }))
            setTableData(addSno)
            setFilteredData(addSno)
            resetForm()
            console.log("All Task records : ", response)
        }
        catch (error) {
            setTableData([])
            setFilteredData([])
            console.log("Error occurs while getting all task : ", error.stack)
        }
    }
    useEffect(() => {
        fetchViewTaksData("All", "All", "All", "All", "ALL")
    }, [])

    useEffect(() => {
        const fetchFieldOptionData = async () => {
            try {
                const clientresponse = await getClient();
                console.log("Client API Response:", clientresponse);
                const updatedFormFields = ViewTaskField.map((field) => {
                    if (field.name === "client") {
                        if (Array.isArray(clientresponse.data.data) && clientresponse.data.data.length > 0) {
                            const clientOptions = clientresponse.data.data.map((item) => ({
                                value: item.client_id,
                                label: item.client_name,
                            }));
                            console.log("Mapped Client Options:", [{ value: 'All', label: 'All' }, ...clientOptions]);
                            return { ...field, options: [{ value: 'All', label: 'All' }, ...clientOptions] };

                        } else {
                            console.error("Client data response is not an array or is empty.");
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

    useEffect(() => {

        if (formData.client) {
            const fetchClientOptionData = async () => {
                console.log('formm data', formData)
                try {
                    const payload = {
                        client_id: formData.client,
                    };
                    const serviceresponse = await getServiceByClient(payload);

                    console.log("Client API Response:", serviceresponse.data.data);

                    const updatedFormFields = await formFields.map((field) => {

                        if (field.name === "service") {
                            console.log('service', formFields)
                            if (Array.isArray(serviceresponse.data.data) && serviceresponse.data.data.length > 0) {
                                const serviceOptions = serviceresponse.data.data.map((item) => ({
                                    value: item.service_id,
                                    label: item.service_name,
                                }));

                                console.log('serviceOptions : ', serviceOptions, formFields)
                                return {
                                    ...field,
                                    options: [{ value: 'All', label: 'All' }, ...serviceOptions]
                                };
                            } else {
                                console.error("Student data response is not an array or is empty.");
                            }
                        }
                        return field;
                    });
                    setFormFields(updatedFormFields);
                    console.log("Mapped Student Options:", formFields);

                } catch (error) {
                    console.error("Error fetching Student data:", error);
                }
            };

            fetchClientOptionData();
        }
    }, [formData.client]);

    useEffect(() => {

        if (formData.service) {
            const fetchClientOptionData = async () => {
                console.log('formm data', formData)
                try {
                    const payload = {
                        "client_id": formData?.client || '',
                        "service_id": formData?.service || ''
                    };
                    const employeeresponse = await getEmployeeByService(payload);

                    console.log("Employee API Response:", employeeresponse.data.data);

                    const updatedFormFields = await formFields.map((field) => {

                        if (field.name === "employee") {
                            console.log('employee', formFields)
                            if (Array.isArray(employeeresponse.data.data) && employeeresponse.data.data.length > 0) {
                                const employeeOptions = employeeresponse.data.data.map((item) => ({
                                    value: item.employee_id,
                                    label: item.name,
                                }));

                                console.log('employeeOptions : ', employeeOptions, formFields)
                                return {
                                    ...field,
                                    options: [{ value: 'All', label: 'All' }, ...employeeOptions]
                                };
                            } else {
                                console.error("Student data response is not an array or is empty.");
                            }
                        }
                        return field;
                    });
                    setFormFields(updatedFormFields);
                    console.log("Mapped Student Options:", formFields);

                } catch (error) {
                    console.error("Error fetching Student data:", error);
                }
            };

            fetchClientOptionData();
        }
    }, [formData.service]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const onDelete = useCallback(async (updatedData, index) => {
        console.log("update dataaa", updatedData)
        const result = await Swal.fire({
            title: "Are you sure about delete task?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
        });
        if (result.isConfirmed) {
            try {
                const payload = { id: updatedData.task_id };
                const response = await deleteTaskData(payload);
                if (response.data.status) {
                    setFilteredData((prevFilteredData) =>
                        prevFilteredData
                            .filter((item, ind) => ind !== index)
                            .map((item, ind) => ({ ...item, sno: ind + 1 }))
                    );

                    setTableData((prevTableData) =>
                        prevTableData
                            .filter((item, ind) => ind !== index)
                            .map((item, ind) => ({ ...item, sno: ind + 1 }))
                    );

                    Swal.fire("Deleted!", response?.data?.message || "Task deleted successfully.", "success");
                }
            } catch (error) {
                Swal.fire("Error", error.response?.data?.message || "Failed to delete task.", "error");
            }

        }

    }, []);

    const handleAdd = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            console.log("Selected form view task:", formData);
            fetchViewTaksData(
                formData?.client || '',
                formData?.service || '',
                formData?.employee || '',
                formData?.priority || '',
                formData?.status || ''
            ).catch((err) => {
                Swal.fire("Error", err.response?.data?.message || "Failed to add employee data.", "error");
            })

        } catch (err) {
            console.error("Error while get task data:", err.stack);
            setTableData([])
            setFilteredData([])
            Swal.fire("Error", err.response?.data?.message || "Failed to add employee data.", "error");
        }

    };

    const updateEmployeeOptions = async () => {
        const updatedFields = await Promise.all(
            taskFormFileds.map(async (data) => {
                if (data.name === "employee") {
                    const employeedata = await getEmployee();
                    return {
                        ...data,
                        options: employeedata.data.data.map((emp) => ({
                            label: emp.name,
                            value: emp.employee_id
                        }))
                    };
                }
                return data;
            })
        );
        console.log("updatedFields", updatedFields)
        setTaskFormFields(updatedFields);
    }

    const handlerEdit = (data, index) => {
        console.log("dataaaa", data, index, taskFormFileds, initialModelValues)
        updateEmployeeOptions()
        console.log("dataaaa", data, index, taskFormFileds, taskFormFileds)
        const date1 = new Date()

        setInitialModelValues((prev) => ({
            ...prev,
            taskName: data?.task_name || '',
            employee: data?.assignTo || '',
            service: data?.service_name || '',
            client: data?.client_name || date1,
            assignedDate: data?.assigned_date || date1,
            targetDate: data?.due_date || '',
            priority: data?.priority || '',
            status: data.status || '',
            task_id: data?.task_id || ''
        }))

        setShowModal(true)
    }

    const handleSubmit = async (values) => {
        console.log("Submitted values:", values);
        const emp_ids = values.employee.map((data) => data.value)
        try {
            const payload = {
                "task_id": values?.task_id || '',
                "task_name": values?.taskName || '',
                "assignTo": emp_ids || [],
                "assignDate": values?.assignedDate || '',
                "dueDate": values?.targetDate || '',
                "priority": values?.priority || '',
                "description": '',
                "status": String(values?.status) || ''
            }
            const response = await editTaskData(payload)
            if (!response.data.status) {
                return Swal.fire("Error", response.data.message || "Failed to add task.", "error");
            }
            fetchViewTaksData("All", "All", "All", "All", "ALL")
            Swal.fire("Success", `Task edited successfully`, "success");
        }
        catch (err) {
            Swal.fire("Error", err.response?.data?.message || "Failed to edit task data.", "error");
            console.log("Error occurs edit task data : ", err.stack)
        }
        setShowModal(false);
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
                                />
                            </Col>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col xl={12}>
                    <Card className="custom-card p-3">
                        <Card.Title className="d-flex">
                            <div className="d-flex justify-content-between
                            border-bottom border-block-end-dashed w-100 pb-3"
                            >
                                <div className="w-25 px-1">
                                    <Search list={tableData} onSearch={(result) => setFilteredData(result)} />
                                </div>
                                <div className="d-flex gap-4 align-items-end">
                                </div>
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
                                    // onDelete={onDelete}
                                    handlerEdit={handlerEdit}
                                />
                            </Suspense>
                        </Card.Body>
                    </Card>
                </Col>

                <CustomModalBox
                    show={showModal}
                    handleClose={() => setShowModal(false)}
                    handleSubmit={handleSubmit}
                    initialValues={initialModelValues}
                    validationSchema={validationSchema}
                    formFields={taskFormFileds}
                />
            </Row>
        </Fragment>
    );
};

export default ViewTask;
