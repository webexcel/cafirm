import React, { Fragment, useCallback, useState, useEffect, Suspense } from "react";
import { Row, Col, Card, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import CustomForm from "../../components/custom/form/CustomForm";
import Loader from "../../components/common/loader/loader";
import useForm from "../../hooks/useForm";
import validateCustomForm from "../../components/custom/form/ValidateForm";
import { addService, deleteService, getService } from "../../service/masterDetails/serviceApi";
import { usePermission } from "../../contexts";
import { CreateFinYearFields } from "../../constants/fields/masterClassFields";
import { addYear, deleteYear, editYear, getYearList } from "../../service/masterDetails/createFinYear";
const CustomTable = React.lazy(() =>
    import("../../components/custom/table/CustomTable")
);


const CreateFinYear = () => {
    const [tableData, setTableData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(15);
    const [filteredData, setFilteredData] = useState([]);
    const [formFields, setFormFields] = useState(CreateFinYearFields);
    const { permissions, getOperationFlagsById } = usePermission();
    const [permissionFlags, setPermissionFlags] = useState(1);

    const columns = [
        { header: "S.No", accessor: "sno", editable: false },
        { header: "Fin Year", accessor: "year", editable: true },
        { header: "Actions", accessor: "Actions", editable: false },
    ];

    // Initialize form state from field definitions
    const initialFormState = CreateFinYearFields.reduce((acc, field) => {
        acc[field.name] = "";
        return acc;
    }, {});

    const { formData, errors, handleInputChange, validateForm, resetForm } = useForm(
        initialFormState,
        (data) => validateCustomForm(data, CreateFinYearFields)
    );

    const fetchYearData = async () => {
        try {
            const response = await getYearList()
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
        fetchYearData()
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
            title: "Are you sure about add financial year ?",
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
                const { year } = formData;
                const payload = {
                    year: year,
                }
                const response = await addYear(payload);
                if (!response.data.status) {
                    return Swal.fire("Error", response.data.message || "Failed to add financial year.", "error");
                }
                Swal.fire("Success", `Financial Year added successfully`, "success");
                resetForm()
                fetchYearData()
            } catch (err) {
                console.error("Error while get financial year:", err.stack);
                Swal.fire("Error", err.response?.data?.message || "Failed to add financial year.", "error");
            }
        }

    };

    const onDelete = useCallback(async (updatedData, index) => {
        console.log("update dataaa", updatedData);
        const result = await Swal.fire({
            title: "Are you sure you want to delete this year?",
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
                const response = await deleteYear(payload);

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

                    Swal.fire("Deleted!", response?.data?.message || "Financial year deleted successfully.", "success");
                }
            } catch (error) {
                Swal.fire("Error", error.response?.data?.message || "Failed to delete financial year.", "error");
            }
        }
    }, []); // Keep dependencies empty, but functional updates fix the stale state issue


    const handleSaveEdit = async (index, updatedData) => {

        console.log("update valuess", updatedData)

        const payload = {
            "id": updatedData?.id || "",
            "year": updatedData?.year || ""
        }

        try {
            const response = await editYear(payload);
            if (response.data) {
                setFilteredData((prevData) =>
                    prevData.map((row, i) => (i === index ? { ...row, ...updatedData } : row))
                );
                Swal.fire({
                    icon: "success",
                    title: "Financial year Edited Successfully!",
                    confirmButtonText: "OK",
                });
            }
        } catch (error) {
            console.log("error in edit year", error)
            Swal.fire({
                icon: "error",
                title: "Failed to Edit Financial Year",
                text: error?.response?.data?.message || "Something went wrong while editing the financial year.",
                confirmButtonText: "OK",
            });
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
                    </Suspense>
                </Card.Body>
            </Card>
        </Fragment>
    );
};

export default CreateFinYear;
