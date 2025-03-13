
import React, { Fragment, useCallback, useState, useEffect, Suspense } from "react";
import { Button, Card, Col, Row } from "react-bootstrap";
import Swal from "sweetalert2";
import Loader from "../../components/common/loader/loader";
import { deleteEmpRecord, getAllEmpRecord } from "../../service/task_management/empMonitor";
import Search from "../../components/common/search/Search";
import CustomForm from "../../components/custom/form/CustomForm";
import validateCustomForm from "../../components/custom/form/ValidateForm";
import useForm from "../../hooks/useForm";
import { ViewTaskField } from "../../constants/fields/taskFields";
const CustomTable = React.lazy(() =>
    import("../../components/custom/table/CustomTable")
);

const ViewTask = () => {

    const [tableData, setTableData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(15);
    const [filteredData, setFilteredData] = useState(tableData);
    const columns = [
        { header: "S No", accessor: "sno", editable: false },
        { header: "Client", accessor: "client_name", editable: false },
        { header: "Employee", accessor: "employee_name", editable: false },
        { header: "Task", accessor: "task_name", editable: false },
        { header: "Service", accessor: "service_name", editable: true },
        { header: "Date", accessor: "assigned_date", editable: true },
        { header: "Minutes", accessor: "total_minutes", editable: true },
        { header: "Description", accessor: "description", editable: true },
        { header: "Actions", accessor: "Actions", editable: false },
    ];
    const [formFields, setFormFields] = useState(ViewTaskField);

    const initialFormState = ViewTaskField.reduce((acc, field) => {
        acc[field.name] = "";
        return acc;
    }, {});

    const { formData, errors, handleInputChange, validateForm, resetForm } = useForm(
        initialFormState,
        (data) => validateCustomForm(data, ViewTaskField)
    );

    const fetchEmpRecords = async (arg) => {
        try {
            const payload = {
                showType: arg
            }
            const response = await getAllEmpRecord(payload)
            const addSno = response?.data?.data.map((data, index) => ({
                sno: index + 1,
                ...data,
                assigned_date: data.assigned_date.split('T')[0]
            }))
            setTableData(addSno)
            setFilteredData(addSno)
            console.log("All Employee records : ", response)
        }
        catch (error) {
            console.log("Error occurs while getting all employee : ", error.stack)
        }
    }

    useEffect(() => {
        fetchEmpRecords("ALL")
    }, [])
    // Handle pagination
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Handle delete class teacher
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
                const payload = { id: updatedData.monitor_id };
                const response = await deleteEmpRecord(payload);
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
                                    {/* <Button className="btn btn-sm py-2 px-4">By Client</Button>
                                    <Button className="btn btn-sm py-2 px-4">By Employee</Button>
                                    <Button className="btn btn-sm py-2 px-4">By Service</Button> */}
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
                                    onDelete={onDelete}
                                />
                            </Suspense>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    );
};

export default ViewTask;
