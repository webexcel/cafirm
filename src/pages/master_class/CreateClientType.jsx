import React, { Fragment, useCallback, useState, useEffect, Suspense } from "react";
import { Row, Col, Card, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import CustomForm from "../../components/custom/form/CustomForm";
import Loader from "../../components/common/loader/loader";
import useForm from "../../hooks/useForm";
import validateCustomForm from "../../components/custom/form/ValidateForm";
import { usePermission } from "../../contexts";
import { addYear, deleteYear, editYear, getYearList } from "../../service/masterDetails/createFinYear";
import { CreateClientTypeFields } from "../../constants/fields/masterClassFields";
import { addClientType, deleteClientType, editClientType, getClientType } from "../../service/masterDetails/createClientType";
import LoaderCon from "../../components/common/loader/loadercon";
const CustomTable = React.lazy(() =>
    import("../../components/custom/table/CustomTable")
);


const CreateFinYear = () => {
    const [tableData, setTableData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(15);
    const [filteredData, setFilteredData] = useState([]);
    const [formFields, setFormFields] = useState(CreateClientTypeFields);
    const { permissions, getOperationFlagsById } = usePermission();
    const [permissionFlags, setPermissionFlags] = useState(1);
    const [loader, setLoader] = useState(false)
    const columns = [
        { header: "S.No", accessor: "sno", editable: false },
        { header: "Client Type", accessor: "type_name", editable: true },
        { header: "Actions", accessor: "Actions", editable: false },
    ];

    // Initialize form state from field definitions
    const initialFormState = CreateClientTypeFields.reduce((acc, field) => {
        acc[field.name] = "";
        return acc;
    }, {});

    const { formData, errors, handleInputChange, validateForm, resetForm } = useForm(
        initialFormState,
        (data) => validateCustomForm(data, CreateClientTypeFields)
    );

    const fetchClientData = async () => {
        setLoader(true)
        try {
            const response = await getClientType()
            const addSno = response?.data?.data.map((data, index) => ({
                sno: index + 1,
                ...data
            }))
            if (response.data.status) {
                setLoader(false)
            }
            setTableData(addSno || '')
            setFilteredData(addSno || '')
            setLoader(false)
            console.log("response : ", response)
        }
        catch (error) {
            console.log("Error occurs getting service data : ", error)
        }
    }

    useEffect(() => {
        fetchClientData()
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
        setLoader(true)
        e.preventDefault();
        if (!validateForm()) return;
        const result = await Swal.fire({
            title: "Are you sure about add client type?",
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
                const { client_type } = formData;
                const payload = {
                    client_type_name: client_type,
                }
                const response = await addClientType(payload);
                if (!response.data.status) {
                    return Swal.fire("Error", response.data.message || "Failed to add client type.", "error");
                }
                Swal.fire("Success", `Client Type added successfully`, "success");
                resetForm()
                fetchClientData()
                setLoader(false)
            } catch (err) {
                setLoader(false)
                console.error("Error while get client type:", err.stack);
                Swal.fire("Error", err.response?.data?.message || "Failed to add client type.", "error");
            }
            finally {
                setLoader(false)
            }
        }

    };

    const onDelete = useCallback(async (updatedData, index) => {
        setLoader(true)
        console.log("update dataaa", updatedData);
        const result = await Swal.fire({
            title: "Are you sure you want to delete client type?",
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
                const response = await deleteClientType(payload);

                if (response.data.status) {

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
                    setLoader(false)

                    Swal.fire("Deleted!", response?.data?.message || "Client type deleted successfully.", "success");
                }
            } catch (error) {
                setLoader(false)
                Swal.fire("Error", error.response?.data?.message || "Failed to delete client type.", "error");
            }
            finally {
                setLoader(false)
            }
        }
    }, []); // Keep dependencies empty, but functional updates fix the stale state issue


    const handleSaveEdit = async (index, updatedData) => {
        setLoader(true)
        console.log("update valuess", updatedData)

        const payload = {
            "id": updatedData?.id || "",
            "client_type_name": updatedData?.type_name || ""
        }

        try {
            const response = await editClientType(payload);
            if (response.data) {
                setFilteredData((prevData) =>
                    prevData.map((row, i) => (i === index ? { ...row, ...updatedData } : row))
                );
                setLoader(false)
                Swal.fire({
                    icon: "success",
                    title: "Client Type Edited Successfully!",
                    confirmButtonText: "OK",
                });
            }
        } catch (error) {
            setLoader(false)
            console.log("error in edit year", error)
            Swal.fire({
                icon: "error",
                title: "Failed to Edit Client Type",
                text: error?.response?.data?.message || "Something went wrong while editing the client type.",
                confirmButtonText: "OK",
            });
        }
        finally {
            setLoader(false)
        }
        setEditingIndex(null);
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
                                    showAddButton={permissionFlags?.showCREATE}
                                    showUpdateButton={permissionFlags?.showUPDATE}
                                />
                            </Col>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className="custom-card p-3">
                <Card.Body className="overflow-auto">
                    <Suspense fallback={<Loader />}>
                        {
                            loader ? <LoaderCon /> : (
                                <CustomTable
                                    columns={columns}
                                    data={filteredData}
                                    currentPage={currentPage}
                                    recordsPerPage={recordsPerPage}
                                    totalRecords={filteredData.length}
                                    handlePageChange={handlePageChange}
                                    onDelete={onDelete}
                                    showDeleteButton={permissionFlags?.showDELETE}
                                    showUpdateButton={permissionFlags?.showUPDATE}
                                    onEdit={handleSaveEdit}
                                />
                            )
                        }
                    </Suspense>
                </Card.Body>
            </Card>
        </Fragment>
    );
};

export default CreateFinYear;
