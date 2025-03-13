
import React, { Fragment, useCallback, useState, useEffect, Suspense } from "react";
import { Row, Col, Card, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import CustomForm from "../../components/custom/form/CustomForm";
import Loader from "../../components/common/loader/loader";
import useForm from "../../hooks/useForm";
import validateCustomForm from "../../components/custom/form/ValidateForm";
import { CreateServiceFields } from "../../constants/fields/masterClassFields";
import { addService, deleteService, getService } from "../../service/masterDetails/serviceApi";
const CustomTable = React.lazy(() =>
    import("../../components/custom/table/CustomTable")
);


const CreateService = () => {
    const [tableData, setTableData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(15);
    const [filteredData, setFilteredData] = useState([]);
    const [formFields, setFormFields] = useState(CreateServiceFields);

    const columns = [
        { header: "S.No", accessor: "sno", editable: false },
        { header: "Service", accessor: "service_name", editable: true },
        { header: "Actions", accessor: "Actions", editable: false },
    ];

    // Initialize form state from field definitions
    const initialFormState = CreateServiceFields.reduce((acc, field) => {
        acc[field.name] = "";
        return acc;
    }, {});

    const { formData, errors, handleInputChange, validateForm, resetForm } = useForm(
        initialFormState,
        (data) => validateCustomForm(data, CreateServiceFields)
    );

    const fetchServiceData = async () => {
        try {
            const response = await getService()
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
        fetchServiceData()
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
                const { service } = formData;
                const payload = {
                    service_name: service,
                }
                const response = await addService(payload);
                if (!response.data.status) {
                    return Swal.fire("Error", response.data.message || "Failed to add service.", "error");
                }
                Swal.fire("Success", `Service added successfully`, "success");
                resetForm()
                fetchServiceData()
            } catch (err) {
                console.error("Error while get service data:", err.stack);
                Swal.fire("Error", err.response?.data?.message || "Failed to add service data.", "error");
            }
        }

    };

    const onDelete = useCallback(async (updatedData, index) => {
        console.log("update dataaa", updatedData);
    
        const result = await Swal.fire({
            title: "Are you sure you want to delete this service?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
        });
    
        if (result.isConfirmed) {
            try {
                const payload = { id: updatedData?.service_id };
                const response = await deleteService(payload);
    
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
    
                    Swal.fire("Deleted!", response?.data?.message || "Service deleted successfully.", "success");
                }
            } catch (error) {
                Swal.fire("Error", error.response?.data?.message || "Failed to delete service.", "error");
            }
        }
    }, []); // Keep dependencies empty, but functional updates fix the stale state issue
    

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
                        />
                    </Suspense>
                </Card.Body>
            </Card>
        </Fragment>
    );
};

export default CreateService;
