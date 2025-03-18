
import React, { FC, Fragment, useCallback, useEffect, useState } from "react";
import { Button, Card, Col, Dropdown, Form, InputGroup, Modal, Nav, Pagination, Row, Tab } from "react-bootstrap";
import { Option2 } from "./todolistdata";
import * as Yup from "yup";
import { getEmployee } from "../../service/employee_management/createEmployeeService";
import Swal from "sweetalert2";
import { addTask, deleteTaskService, getAllTask, updateTaskStatus } from "../../service/task_management/createTaskServices";
import CreateTaskModel from "./model/CreateTaskModel";
import TaskCard from "./card/TaskCard";
import CreateTicketModel from "./model/CreateTicketModel";
import { addTicket, getAllTicket, updateTicketStatus } from "../../service/task_management/createTicketServices";
import Search from "../../components/common/search/Search";

const TaskTracking = () => {

    const [tabStatus, setTabStatus] = useState('Task')
    const [allTaskTabs] = useState(["all", "pending", "inprogress", "completed"])
    const [allTicketTabs] = useState(["all", "pending", "inprogress", "completed"])
    const [tasks, setTasks] = useState(
        allTaskTabs.reduce((acc, key) => {
            acc[key] = [];
            return acc;
        }, {})
    );
    const [tickets, setTickets] = useState(
        allTicketTabs.reduce((acc, key) => {
            acc[key] = [];
            return acc;
        }, {})
    );
    console.log("task", "ticket", tasks, tickets)
    const [panelTabKey] = useState([
        {
            labelKey: 'all',
            label: 'All Task',
            paramKey: 'ALL'
        },
        {
            labelKey: 'pending',
            label: 'Pending',
            paramKey: 'PENDING'
        },
        {
            labelKey: 'inprogress',
            label: 'In Progress',
            paramKey: 'INPROCESS'
        },
        {
            labelKey: 'completed',
            label: 'Completed',
            paramKey: 'COMPLETED'
        },
    ])
    const [panelTabTicketKey] = useState([
        {
            labelKey: 'all',
            label: 'All Ticket',
            paramKey: 'ALL'
        },
        {
            labelKey: 'pending',
            label: 'Pending',
            paramKey: 'PENDING'
        },
        {
            labelKey: 'inprogress',
            label: 'In Progress',
            paramKey: 'INPROCESS'
        },
        {
            labelKey: 'completed',
            label: 'Completed',
            paramKey: 'COMPLETED'
        },
    ])
    const [employeeData, setEmployeeData] = useState([])
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const [show1, setShow1] = useState(false);
    const handleClose1 = () => setShow1(false);
    const handleShow1 = () => setShow1(true);

    useEffect(() => {

    }, [])

    useEffect(() => {
        const getEmployeeData = async () => {
            try {
                const response = await getEmployee()
                const addSno = response.data.data.map((data) => ({
                    value: data?.employee_id || "",
                    label: data?.name || ""
                }))
                setEmployeeData(addSno)
                console.log("response : ", response)
            }
            catch (err) {
                console.log("Error occurs while getting employee data : ", err)
            }
        }
        getEmployeeData()
    }, [])

    const getAllTaskData = async (type) => {
        setTasks(allTaskTabs.reduce((acc, key) => {
            acc[key] = [];
            return acc;
        }, {}))
        try {
            const payload = {
                showType: type || ''
            }
            const response = await getAllTask(payload)
            console.log("View tasks in response : ", tasks)
            const taskData = response.data.data.forEach((data) => {
                setTasks((prev) => {
                    const updatedTasks = { ...prev };
                    switch (Number(data.status)) {
                        case 0:
                            updatedTasks.pending = [...prev.pending, {
                                ...data,
                                switchBack: false,
                                completedBtn: true,
                                switchBackIcon: 'primary',
                                statusBadge: 'danger',
                                deleteBtnColor: 'danger',
                                statusLabel: 'pending'
                            }];
                            break;
                        case 1:
                            updatedTasks.inprogress = [...prev.inprogress, {
                                ...data,
                                switchBack: true,
                                completedBtn: true,
                                switchBackIcon: 'primary',
                                statusBadge: 'info',
                                deleteBtnColor: 'danger',
                                statusLabel: 'inprogress'
                            }];
                            break;
                        case 2:
                            updatedTasks.completed = [...prev.completed, {
                                ...data,
                                switchBack: false,
                                completedBtn: false,
                                switchBackIcon: 'primary',
                                statusBadge: 'success',
                                deleteBtnColor: 'danger',
                                statusLabel: 'completed'
                            }];
                            break;
                    }
                    updatedTasks.all = [...prev.all, {
                        ...data,
                        switchBack: Number(data.status) === 1 ? true : false,
                        switchBackIcon: 'primary',
                        statusBadge: Number(data.status) === 0 ? 'danger' :
                            Number(data.status) === 1 ? 'primary' :
                                Number(data.status) === 2 ? 'success' : '',
                        deleteBtnColor: 'danger',
                        statusLabel: Number(data.status) === 0 ? 'pending' :
                            Number(data.status) === 1 ? 'inprogress' :
                                Number(data.status) === 2 ? 'completed' : '',
                        completedBtn: Number(data.status) === 2 ? false : true
                    }];
                    return updatedTasks;
                });
            });


            console.log("All Task Response : ", response)
        }
        catch (err) {
            console.log("Error occurs while getting the tasks : ", err.stack)
        }
    }

    useEffect(() => { console.log("Show all task : ", tasks) }, [tasks])

    useEffect(() => {
        getAllTaskData("ALL")
    }, [])

    const getAllTicketData = async (type) => {
        setTickets(allTicketTabs.reduce((acc, key) => {
            acc[key] = [];
            return acc;
        }, {}))
        try {
            const payload = {
                showType: type || ''
            }
            const response = await getAllTicket(payload)
            console.log("View tickets in response : ", tasks)
            const ticketData = response.data.data.forEach((data) => {
                setTickets((prev) => {
                    const updateTickets = { ...prev };
                    switch (Number(data.status)) {
                        case 0:
                            updateTickets.pending = [...prev.pending, {
                                ...data,
                                switchBack: false,
                                completedBtn: true,
                                switchBackIcon: 'primary',
                                statusBadge: 'danger',
                                deleteBtnColor: 'danger',
                                statusLabel: 'pending'
                            }];
                            break;
                        case 1:
                            updateTickets.inprogress = [...prev.inprogress, {
                                ...data,
                                switchBack: true,
                                completedBtn: true,
                                switchBackIcon: 'primary',
                                statusBadge: 'info',
                                deleteBtnColor: 'danger',
                                statusLabel: 'inprogress'
                            }];
                            break;
                        case 2:
                            updateTickets.completed = [...prev.completed, {
                                ...data,
                                switchBack: false,
                                completedBtn: false,
                                switchBackIcon: 'primary',
                                statusBadge: 'success',
                                deleteBtnColor: 'danger',
                                statusLabel: 'completed'
                            }];
                            break;
                    }
                    updateTickets.all = [...prev.all, {
                        ...data,
                        switchBack: Number(data.status) === 1 ? true : false,
                        switchBackIcon: 'primary',
                        statusBadge: Number(data.status) === 0 ? 'danger' :
                            Number(data.status) === 1 ? 'primary' :
                                Number(data.status) === 2 ? 'success' : '',
                        deleteBtnColor: 'danger',
                        statusLabel: Number(data.status) === 0 ? 'pending' :
                            Number(data.status) === 1 ? 'inprogress' :
                                Number(data.status) === 2 ? 'completed' : '',
                        completedBtn: Number(data.status) === 2 ? false : true
                    }];
                    return updateTickets;
                });
            });


            console.log("All Task Response : ", response)
        }
        catch (err) {
            console.log("Error occurs while getting the tasks : ", err.stack)
        }
    }

    useEffect(() => {
        getAllTicketData("ALL")
    }, [])

    const handleSubmit = useCallback(async (values) => {
        console.log("Form Submitted:", values);
        const result = await Swal.fire({
            title: "Are you sure about adding the task?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Add it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
        });
        if (result.isConfirmed) {
            try {
                const empIds = values.assignedTo.map((data) => data.value);

                const payload = {
                    name: values?.taskName || "",
                    service: values?.service || "",
                    assignTo: empIds || [],
                    assignDate: `${values.assignedDate.getFullYear()}/${String(values.assignedDate.getMonth() + 1).padStart(2, "0")
                        }/${String(values.assignedDate.getDate()).padStart(2, "0")}`,
                    dueDate: `${values?.targetDate.getFullYear()}/${String(values?.targetDate.getMonth() + 1).padStart(2, "0")
                        }/${String(values?.targetDate.getDate()).padStart(2, "0")}`,
                    priority: values?.priority || "",
                };

                const response = await addTask(payload);

                if (!response.data.status) {
                    return Swal.fire("Error", response.data.message || "Failed to add task.", "error");
                }

                Swal.fire("Success", "Task added successfully", "success");
                getAllTaskData("ALL")
                handleClose();
            } catch (err) {
                console.error("Error while adding task data:", err.stack);
                Swal.fire("Error", err.response?.data?.message || "Failed to add task data.", "error");
            }
        }
    }, []);

    const handleTicketSubmit = useCallback(async (values) => {
        console.log("Form Submitted:", values);
        const result = await Swal.fire({
            title: "Are you sure about adding the ticket?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Add it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
        });
        if (result.isConfirmed) {
            try {
                const empIds = values.assignedTo.map((data) => data.value);
                const payload = {
                    name: values?.ticketName || "",
                    service: values?.service || "",
                    assignTo: empIds || [],
                    assignDate: `${values.assignedDate.getFullYear()}/${String(values.assignedDate.getMonth() + 1).padStart(2, "0")
                        }/${String(values.assignedDate.getDate()).padStart(2, "0")}`,
                    dueDate: `${values?.targetDate.getFullYear()}/${String(values?.targetDate.getMonth() + 1).padStart(2, "0")
                        }/${String(values?.targetDate.getDate()).padStart(2, "0")}`,
                    priority: values?.priority || "",
                };
                const response = await addTicket(payload);
                if (!response.data.status) {
                    return Swal.fire("Error", response.data.message || "Failed to add ticket.", "error");
                }
                Swal.fire("Success", "Ticket added successfully", "success");
                getAllTicketData("ALL")
                handleClose1();
            } catch (err) {
                console.error("Error while adding ticket data:", err.stack);
                Swal.fire("Error", err.response?.data?.message || "Failed to add ticket data.", "error");
            }
        }
    }, []);

    const validationSchema = Yup.object().shape({
        taskName: Yup.string().required("Task Name is required"),
        service: Yup.string().required("Service is required"),
        assignedTo: Yup.array().min(1, "At least one assignee is required"),
        assignedDate: Yup.date().required("Assigned Date is required"),
        targetDate: Yup.date()
            .required("Target Date is required")
            .min(Yup.ref("assignedDate"), "Target Date must be after Assigned Date"),
        priority: Yup.string().required("Priority is required"),
    });

    const validationTicketSchema = Yup.object().shape({
        ticketName: Yup.string().required("Ticket Name is required"),
        service: Yup.string().required("Service is required"),
        assignedTo: Yup.array().min(1, "At least one assignee is required"),
        assignedDate: Yup.date().required("Assigned Date is required"),
        targetDate: Yup.date()
            .required("Target Date is required")
            .min(Yup.ref("assignedDate"), "Target Date must be after Assigned Date"),
        priority: Yup.string().required("Priority is required"),
    });


    const handlerOnTaskChange = useCallback(async (taskdata) => {
        console.log("Task : ", taskdata)
        const result = await Swal.fire({
            title: "Are you sure about switch task ?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Switch it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
        });
        if (result.isConfirmed) {
            try {
                const payload = {
                    id: taskdata?.task_id || "",
                    status: String(Number(taskdata.status) + 1),
                };
                const response = await updateTaskStatus(payload);

                if (!response.data.status) {
                    return Swal.fire("Error", response.data.message || "Failed to switch task.", "error");
                }

                Swal.fire("Success", `Task switched successfully`, "success");
                console.log("updatedTask1111111111111111", taskdata)
                setTasks((prev) => {
                    const updatedTask = {
                        ...taskdata,
                        status: Number(taskdata.status) === 0 ? 1 : 2,
                        statusLabel: Number(taskdata.status) === 0 ? "inprogress" : "completed",
                        switchBack: Number(taskdata.status) === 0 ? true : false,
                        completedBtn: Number(taskdata.status) === 1 ? false : true
                    };

                    console.log("updatedTask", updatedTask)

                    return {
                        ...prev,
                        all: prev.all.map((data) =>
                            Number(data.task_id) === Number(taskdata.task_id) ? updatedTask : data
                        ),
                        pending: Number(taskdata.status) === 0
                            ? prev.pending.filter((data) => Number(data.task_id) !== Number(taskdata.task_id))
                            : prev.pending,
                        inprogress: Number(taskdata.status) === 0
                            ? [...prev.inprogress, updatedTask]
                            : prev.inprogress.filter((data) => Number(data.task_id) !== Number(taskdata.task_id)),
                        completed: Number(taskdata.status) === 1 ? [...prev.completed, updatedTask] : prev.completed,
                    };
                });
            } catch (err) {
                console.error("Error while updating task:", err.stack);
                Swal.fire("Error", err.response?.data?.message || "Failed to switch task.", "error");
            }
        }

    }, [])

    const handlerPauseTask = useCallback(async (taskdata) => {
        console.log("Task : ", taskdata)
        const result = await Swal.fire({
            title: "Are you sure about pause task ?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Switch it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
        });
        if (result.isConfirmed) {
            try {
                const payload = {
                    id: taskdata?.task_id || "",
                    status: "0",
                };
                const response = await updateTaskStatus(payload);

                if (!response.data.status) {
                    return Swal.fire("Error", response.data.message || "Failed to switch task.", "error");
                }

                Swal.fire("Success", `Task switched successfully`, "success");
                console.log("updatedTask1111111111111111", taskdata)
                setTasks((prev) => {
                    const updatedTask = {
                        ...taskdata,
                        status: 0,
                        statusLabel: "pending",
                        switchBack: false,
                        completedBtn: true

                    };

                    console.log("updatedTask", updatedTask)

                    return {
                        ...prev,
                        all: prev.all.map((data) =>
                            Number(data.task_id) === Number(taskdata.task_id) ? updatedTask : data
                        ),
                        inprogress: Number(taskdata.status) === 0
                            ? [...prev.inprogress, updatedTask]
                            : prev.inprogress.filter((data) => Number(data.task_id) !== Number(taskdata.task_id)),
                        pending: [...prev.pending, updatedTask]
                    };
                });
            } catch (err) {
                console.error("Error while updating task:", err.stack);
                Swal.fire("Error", err.response?.data?.message || "Failed to switch task.", "error");
            }
        }

    }, [])

    const handlerOnTicketChange = useCallback(async (taskdata) => {
        console.log("Ticket : ", taskdata)
        const result = await Swal.fire({
            title: "Are you sure about switch ticket?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Switch it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
        });
        if (result.isConfirmed) {
            try {
                const payload = {
                    id: taskdata?.ticket_id || "",
                    status: String(Number(taskdata.status) + 1),
                };
                const response = await updateTicketStatus(payload);

                if (!response.data.status) {
                    return Swal.fire("Error", response.data.message || "Failed to switch ticket.", "error");
                }

                Swal.fire("Success", `Ticket switched successfully`, "success");
                console.log("updatedTicket1111111111111111", taskdata)
                setTickets((prev) => {
                    const updatedTask = {
                        ...taskdata,
                        status: Number(taskdata.status) === 0 ? 1 : 2,
                        statusLabel: Number(taskdata.status) === 0 ? "inprogress" : "completed",
                        switchBack: Number(taskdata.status) === 0 ? true : false,
                        completedBtn: Number(taskdata.status) === 1 ? false : true
                    };

                    console.log("updatedTask", updatedTask)

                    return {
                        ...prev,
                        all: prev.all.map((data) =>
                            Number(data.ticket_id) === Number(taskdata.ticket_id) ? updatedTask : data
                        ),
                        pending: Number(taskdata.status) === 0
                            ? prev.pending.filter((data) => Number(data.ticket_id) !== Number(taskdata.ticket_id))
                            : prev.pending,
                        inprogress: Number(taskdata.status) === 0
                            ? [...prev.inprogress, updatedTask]
                            : prev.inprogress.filter((data) => Number(data.ticket_id) !== Number(taskdata.ticket_id)),
                        completed: Number(taskdata.status) === 1 ? [...prev.completed, updatedTask] : prev.completed,
                    };
                });
            } catch (err) {
                console.error("Error while updating ticket:", err.stack);
                Swal.fire("Error", err.response?.data?.message || "Failed to switch ticket.", "error");
            }
        }

    }, [])

    const handlerPauseTicket = useCallback(async (taskdata) => {
        console.log("Task : ", taskdata)
        const result = await Swal.fire({
            title: "Are you sure about pause task ?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Switch it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
        });
        if (result.isConfirmed) {
            try {
                const payload = {
                    id: taskdata?.ticket_id || "",
                    status: "0",
                };
                const response = await updateTaskStatus(payload);

                if (!response.data.status) {
                    return Swal.fire("Error", response.data.message || "Failed to switch task.", "error");
                }

                Swal.fire("Success", `Task switched successfully`, "success");
                console.log("updatedTask1111111111111111", taskdata)
                setTickets((prev) => {
                    const updatedTask = {
                        ...taskdata,
                        status: 0,
                        statusLabel: "pending",
                        switchBack: false,
                        completedBtn: true

                    };

                    console.log("updatedTask", updatedTask)

                    return {
                        ...prev,
                        all: prev.all.map((data) =>
                            Number(data.ticket_id) === Number(taskdata.ticket_id) ? updatedTask : data
                        ),
                        inprogress: Number(taskdata.status) === 0
                            ? [...prev.inprogress, updatedTask]
                            : prev.inprogress.filter((data) => Number(data.ticket_id) !== Number(taskdata.ticket_id)),
                        pending: [...prev.pending, updatedTask]
                    };
                });
            } catch (err) {
                console.error("Error while updating task:", err.stack);
                Swal.fire("Error", err.response?.data?.message || "Failed to switch task.", "error");
            }
        }

    }, [])

    const onHandlerCreateTask = () => {
        setTabStatus('Task')
        handleShow()
    }

    const onHandlerCreateTicket = () => {
        setTabStatus('Ticket')
        handleShow1()
    }

    const deleteTask = useCallback(async (task) => {
        if (!task?.task_id) return;
        const result = await Swal.fire({
            title: "Are you sure you want to delete this task?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Delete it!",
            cancelButtonText: "No, Cancel!",
            reverseButtons: true,
        });

        if (!result.isConfirmed) return;

        try {
            const response = await deleteTaskService({ id: task.task_id });

            if (!response.data.status) {
                return Swal.fire("Error", response.data.message || "Failed to delete task.", "error");
            }

            Swal.fire("Success", "Task deleted successfully", "success");

            setTasks((prev) => {
                return Object.keys(prev).reduce((acc, key) => {
                    acc[key] = prev[key].filter(({ task_id }) => Number(task_id) !== Number(task.task_id));
                    return acc;
                }, {});
            });
        } catch (err) {
            console.error("Error while deleting task:", err);
            Swal.fire("Error", err.response?.data?.message || "Failed to delete task.", "error");
        }
    }, []);

    const deleteTicket = useCallback(async (ticket) => {
        console.log("Ticket : ", ticket)
        if (!ticket?.ticket_id) return;
        const result = await Swal.fire({
            title: "Are you sure you want to delete ticket?",
            text: "This action cannot be undone!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Delete it!",
            cancelButtonText: "No, Cancel!",
            reverseButtons: true,
        });

        if (!result.isConfirmed) return;

        try {
            const response = await deleteTaskService({ id: ticket.ticket_id });

            if (!response.data.status) {
                return Swal.fire("Error", response.data.message || "Failed to delete ticket.", "error");
            }

            Swal.fire("Success", "Ticket deleted successfully", "success");

            setTickets((prev) => {
                return Object.keys(prev).reduce((acc, key) => {
                    acc[key] = prev[key].filter(({ ticket_id }) => ticket_id !== ticket.ticket_id);
                    return acc;
                }, {});
            });
        } catch (err) {
            console.error("Error while deleting ticket:", err);
            Swal.fire("Error", err.response?.data?.message || "Failed to delete ticket.", "error");
        }
    }, []);

    const setFilteredData = useCallback((searchdata) => {
        console.log("searchdata", searchdata)
        setTasks((prev) => ({
            ...prev,
            all: searchdata
        }))
    }, [])

    return (
        <Fragment>
            <Row>
                <Tab.Container defaultActiveKey="Task">
                    <Col xl={12}>
                        <Card className="custom-card py-0">
                            <div className="d-flex p-0 justify-content-between pl-4">
                                <div className="d-flex align-items-center justify-content-between w-100" style={{ padding: '10px' }}>

                                    <div>
                                        <Nav className="nav-tabs nav-tabs-header mb-0 d-sm-flex d-block p-0" role="tablist" defaultActiveKey="first">
                                            <Nav.Item as="li" className="m-1" onClick={() => { setTabStatus('Task') }}>
                                                <Nav.Link eventKey="Task" className="px-5 py-2" style={{ fontWeight: '600' }}>Tasks</Nav.Link>
                                            </Nav.Item>
                                            <Nav.Item as="li" className="m-1" onClick={() => { setTabStatus('Ticket') }}>
                                                <Nav.Link eventKey="Ticket" className="px-5 py-2" style={{ fontWeight: '600' }}>Ticket</Nav.Link>
                                            </Nav.Item>
                                        </Nav>
                                    </div>

                                    <div>
                                        {
                                            tabStatus == 'Task' ? (<Button type="button" className="btn btn-sm btn-primary d-flex align-items-center justify-content-center my-1 me-3" onClick={onHandlerCreateTask}
                                                data-bs-toggle="modal" data-bs-target="#addtask">
                                                <i className="ri-add-circle-line fs-16 align-middle me-1"></i>Create Task
                                            </Button>) : (
                                                <Button type="button" className="btn btn-sm btn-primary d-flex align-items-center justify-content-center my-1 me-3" onClick={onHandlerCreateTicket}
                                                    data-bs-toggle="modal" data-bs-target="#addticket"
                                                >
                                                    <i className="ri-add-circle-line fs-16 align-middle me-1"></i>Create Ticket
                                                </Button>
                                            )
                                        }

                                    </div>
                                </div>
                            </div>
                        </Card>
                    </Col>
                    <Tab.Content className="task-tabs-container">
                        <Tab.Pane eventKey="Task" className="p-0" id="all-tasks"
                            role="tabpanel">
                            <Row id="tasks-container">
                                <Col xl={12}>
                                    <Row>
                                        <Tab.Container defaultActiveKey="all">
                                            <Col xl={12}>
                                                <Card className="custom-card">
                                                    <div className="d-flex p-0 justify-content-between pl-4">
                                                        <div className="d-flex align-items-center">
                                                            <div className="p-3 border-bottom border-block-end-dashed">
                                                                <Search list={tasks?.all || []} onSearch={(result) => setFilteredData(result)} />

                                                            </div>
                                                        </div>
                                                        <div className="d-flex p-3 align-items-center justify-content-end">
                                                            <div>
                                                                <Nav className="nav-tabs nav-tabs-header mb-0 d-sm-flex d-block" role="tablist" defaultActiveKey="all">

                                                                    {
                                                                        panelTabKey.map((data, index) => (
                                                                            <Nav.Item as="li" className="m-1" key={index}>
                                                                                <Nav.Link eventKey={data.labelKey}>{data.label}</Nav.Link>
                                                                            </Nav.Item>
                                                                        ))
                                                                    }
                                                                </Nav>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </Col>
                                            <Tab.Content className="task-tabs-container">

                                                {
                                                    allTaskTabs.map((data, index) => (
                                                        <Tab.Pane eventKey={data} className="p-0" id={`task-${data}`} key={index}
                                                            role="tabpanel">
                                                            <Row id="tasks-container">
                                                                {tasks[data].map((idx) => (
                                                                    <Col xxl={4} md={4} className="task-card" key={Math.random()}>
                                                                        <TaskCard
                                                                            idx={idx}
                                                                            handlerOnTaskChange={handlerOnTaskChange}
                                                                            handlerPauseTask={handlerPauseTask}
                                                                            onHandleDelete={deleteTask}
                                                                        />
                                                                    </Col>
                                                                ))}
                                                            </Row>
                                                        </Tab.Pane>
                                                    ))
                                                }

                                            </Tab.Content>
                                        </Tab.Container>
                                    </Row>

                                    <div className="float-end mb-4">
                                        <nav aria-label="Page navigation" className="pagination-style-4">
                                            <Pagination className="mb-0  gap-2">
                                                <Pagination.Item disabled href="#">
                                                    Prev
                                                </Pagination.Item>
                                                <Pagination.Item active href="#">1</Pagination.Item>
                                                <Pagination.Item className="" href="#">2</Pagination.Item>
                                                <Pagination.Item>
                                                    <i className="bi bi-three-dots"></i>
                                                </Pagination.Item>
                                                <Pagination.Item className="page-item d-none d-sm-flex" href="#">16</Pagination.Item>
                                                <Pagination.Item href="#">17</Pagination.Item>
                                                <Pagination.Item className=" text-primary">
                                                    next
                                                </Pagination.Item>
                                            </Pagination>
                                        </nav>
                                    </div>

                                </Col>
                            </Row>
                        </Tab.Pane>

                        <Tab.Pane eventKey="Ticket" className="p-0" id="all-tasks"
                            role="tabpanel">
                            <Row id="tasks-container">
                                <Col xl={12}>
                                    <Row>
                                        <Tab.Container defaultActiveKey="all">
                                            <Col xl={12}>
                                                <Card className="custom-card">
                                                    <div className="d-flex p-0 justify-content-between pl-4">
                                                        <div className="d-flex align-items-center">
                                                            <div className="p-3 border-bottom border-block-end-dashed">
                                                                <Search />
                                                            </div>
                                                        </div>
                                                        <div className="d-flex p-3 align-items-center justify-content-end">
                                                            <div>
                                                                <Nav className="nav-tabs nav-tabs-header mb-0 d-sm-flex d-block" role="tablist" defaultActiveKey="all">

                                                                    {
                                                                        panelTabTicketKey.map((data, index) => (
                                                                            <Nav.Item as="li" className="m-1" key={index}>
                                                                                <Nav.Link eventKey={data.labelKey}>{data.label}</Nav.Link>
                                                                            </Nav.Item>
                                                                        ))
                                                                    }
                                                                </Nav>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </Col>
                                            <Tab.Content className="task-tabs-container">

                                                {
                                                    allTaskTabs.map((data, index) => (
                                                        <Tab.Pane eventKey={data} className="p-0" id={`task-${data}`} key={index}
                                                            role="tabpanel">
                                                            <Row id="tasks-container">
                                                                {tickets[data].map((idx) => (
                                                                    <Col xxl={4} md={4} className="task-card" key={Math.random()}>
                                                                        <TaskCard
                                                                            idx={idx}
                                                                            handlerOnTaskChange={handlerOnTicketChange}
                                                                            handlerPauseTask={handlerPauseTicket}
                                                                            onHandleDelete={deleteTicket}
                                                                        />
                                                                    </Col>
                                                                ))}
                                                            </Row>
                                                        </Tab.Pane>
                                                    ))
                                                }

                                            </Tab.Content>
                                        </Tab.Container>
                                    </Row>

                                    <div className="float-end mb-4">
                                        <nav aria-label="Page navigation" className="pagination-style-4">
                                            <Pagination className="mb-0  gap-2">
                                                <Pagination.Item disabled href="#">
                                                    Prev
                                                </Pagination.Item>
                                                <Pagination.Item active href="#">1</Pagination.Item>
                                                <Pagination.Item className="" href="#">2</Pagination.Item>
                                                <Pagination.Item>
                                                    <i className="bi bi-three-dots"></i>
                                                </Pagination.Item>
                                                <Pagination.Item className="page-item d-none d-sm-flex" href="#">16</Pagination.Item>
                                                <Pagination.Item href="#">17</Pagination.Item>
                                                <Pagination.Item className=" text-primary">
                                                    next
                                                </Pagination.Item>
                                            </Pagination>
                                        </nav>
                                    </div>

                                </Col>
                            </Row>
                        </Tab.Pane>

                    </Tab.Content>
                </Tab.Container>

                <CreateTaskModel show={show}
                    handleClose={handleClose}
                    employeeData={employeeData}
                    Option2={Option2}
                    handleSubmit={handleSubmit}
                    validationSchema={validationSchema} />

                <CreateTicketModel show={show1}
                    handleClose={handleClose1}
                    employeeData={employeeData}
                    Option2={Option2}
                    handleTicketSubmit={handleTicketSubmit}
                    validationSchema={validationTicketSchema} />

            </Row>

        </Fragment>
    );
};

export default TaskTracking;
