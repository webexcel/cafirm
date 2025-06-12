
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

const CreateDocType = () => {
    const [tableData, setTableData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(15);
    const [filteredData, setFilteredData] = useState([]);
    const [formFields, setFormFields] = useState(CreateDocTypeFields);
    const { permissions, getOperationFlagsById } = usePermission();
    const [permissionFlags, setPermissionFlags] = useState(1);

    const columns = [
        { header: "S.No", accessor: "sno", editable: false },
        { header: "Doc Type", accessor: "type_name", editable: true },
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
            setTableData(addSno || '')
            setFilteredData(addSno || '')
            console.log("response : ", response)
        }
        catch (error) {
            console.log("Error occurs getting service data : ", error)
        }
    }

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

    const handleSaveEdit = useCallback(async (index, updatedData) => {


        try {
            const payload = {
                confstypeid: updatedData.id, confsype: updatedData.con_type, status: updatedData.status
            };

            const response = await editConcession(payload);

            if (response.data.status) {
                setTableData(prevData =>
                    prevData.map((row, i) => (i === index ? { ...row, ...updatedData } : row))
                );
                fetchConcessionTypeData()
                Swal.fire({
                    icon: "success",
                    title: "Concession Type Edited Successfully!",
                    confirmButtonText: "OK",
                });
            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Failed to Edit Concession Type!",
                text: error?.response?.data?.message || "Something went wrong while editing the concession type.",
                confirmButtonText: "OK",
            });
        }

        setEditingIndex(null);
    }, []);

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
                                    showAddButton={true}
                                    showUpdateButton={true}

                                />

                            </Col>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className="custom-card p-3">
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
                            // handlerEdit={handleSaveEdit}
                            showDeleteButton={true}
                            showUpdateButton={true}

                        />
                    </Suspense>
                </Card.Body>
            </Card>
        </Fragment>
    );
};

export default CreateDocType;
