
import React, { Fragment, useCallback, useState, useEffect, Suspense } from "react";
import { Row, Col, Card, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import CustomForm from "../../components/custom/form/CustomForm";
import Loader from "../../components/common/loader/loader";
import useForm from "../../hooks/useForm";
import validateCustomForm from "../../components/custom/form/ValidateForm";
import { deleteService } from "../../service/masterDetails/serviceApi";
import { usePermission } from "../../contexts";
import { CreateDocTypeFields } from "../../constants/fields/masterClassFields";
import { addDocumentType, deleteDocumentType, getDocumentType } from "../../service/masterDetails/createDocument";
const CustomTable = React.lazy(() =>
    import("../../components/custom/table/CustomTable")
);


const ShowTaskTable = () => {
    const [tableData, setTableData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(15);
    const [filteredData, setFilteredData] = useState([]);
    const [formFields, setFormFields] = useState(CreateDocTypeFields);
    const { permissions, getOperationFlagsById,task_id } = usePermission();
    const [permissionFlags, setPermissionFlags] = useState(1);

    const columns = [
        { header: "S.No", accessor: "sno", editable: false },
        { header: "Task Name", accessor: "task_name", editable: true },
        { header: "Employee Name", accessor: "employee_name", editable: true },
        { header: "Date", accessor: "date", editable: true },
        { header: "Total Time", accessor: "total_time", editable: true },
        { header: "Actions", accessor: "Actions", editable: false },
    ];

    // Initialize form state from field definitions
    const initialFormState = CreateDocTypeFields.reduce((acc, field) => {
        acc[field.name] = "";
        return acc;
    }, {});

    const { formData, errors, handleInputChange, validateForm, resetForm } = useForm(
        initialFormState,
        (data) => validateCustomForm(data, CreateDocTypeFields)
    );


    const fetchDocumentData = async () => {
        try {
            const response = await getDocumentType()
            const addSno = response?.data?.data.map((data, index) => ({
                sno: index + 1,
                ...data
            }))
            // setTableData(addSno || '')
            // setFilteredData(addSno || '')
            console.log("response : ", response)
        }
        catch (error) {
            console.log("Error occurs getting service data : ", error)
        }
    }
    useEffect(() =>{
        console.log("task_idtask_idtask_idtask_id",task_id)
    },[task_id])

    useEffect(() => {
        fetchDocumentData()
        const permissionFlags = getOperationFlagsById(17, 1); // paren_id , sub_menu id
        console.log(permissionFlags, '---permissionFlags');
        setPermissionFlags(permissionFlags);
    }, [])

    // Handle pagination
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Handle add
    const handleAdd = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        const result = await Swal.fire({
            title: "Are you sure about add service ?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Add it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
        });
        if (result.isConfirmed) {
            try {
                console.log("Selected form:", formData);
                const { type } = formData;
                const payload = {
                    "document_type": type
                }
                const response = await addDocumentType(payload);
                if (!response.data.status) {
                    return Swal.fire("Error", response.data.message || "Failed to add Type.", "error");
                }
                Swal.fire("Success", `Type added successfully`, "success");
                fetchDocumentData()
                resetForm()
            } catch (err) {
                console.error("Error while get Type data:", err.stack);
                Swal.fire("Error", err.response?.data?.message || "Failed to add Type data.", "error");
            }
        }

    };

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

    const onDelete = useCallback(async (updatedData, index) => {
        console.log("update dataaa", updatedData);

        const result = await Swal.fire({
            title: "Are you sure you want to delete doc type?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            try {
                const payload = { id: updatedData?.id };
                const response = await deleteDocumentType(payload);

                if (response.data.status) {
                    // Use functional state updates to get the latest data
                    setFilteredData((prevFilteredData) =>
                        prevFilteredData
                            .filter((item, ind) => ind !== index) // Remove the item
                            .map((item, ind) => ({ ...item, sno: ind + 1 })) // Re-index
                    );

                    setTableData((prevTableData) =>
                        prevTableData
                            .filter((item, ind) => ind !== index)
                            .map((item, ind) => ({ ...item, sno: ind + 1 }))
                    );

                    Swal.fire("Deleted!", response?.data?.message || "Documnet Type deleted successfully.", "success");
                }
            } catch (error) {
                Swal.fire("Error", error.response?.data?.message || "Failed to delete doc type.", "error");
            }
        }
    }, []); 


    return (
        <Fragment>

            <Card className="custom-card p-3">
                <Card.Body className="overflow-auto">
                    <Suspense fallback={<Loader />}>
                        <CustomTable
                            columns={columns}
                            data={task_id}
                            currentPage={currentPage}
                            recordsPerPage={recordsPerPage}
                            totalRecords={task_id.length}
                            handlePageChange={handlePageChange}
                            // onDelete={onDelete}
                            // handlerEdit={handlerEdit}
                            // showDeleteButton={true}
                            // showUpdateButton={true}

                        />
                    </Suspense>
                </Card.Body>
            </Card>
        </Fragment>
    );
};

export default ShowTaskTable;
