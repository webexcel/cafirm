
import React, { Fragment, useCallback, useState, useEffect, Suspense } from "react";
import { Row, Col, Card, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import CustomForm from "../../components/custom/form/CustomForm";
import Loader from "../../components/common/loader/loader";
import useForm from "../../hooks/useForm";
import validateCustomForm from "../../components/custom/form/ValidateForm";
import { CreateServiceFields } from "../../constants/fields/masterClassFields";
const CustomTable = React.lazy(() =>
    import("../../components/custom/table/CustomTable")
);


const CreateService = () => {
    const [tableData, setTableData] = useState([
        { sno: 1, client: "Alice Johnson",  service: "Testing", Actions: "" },
        { sno: 2, client: "David Brown",  service: "Testing", Actions: "" },
        { sno: 3, client: "Emma Wilson",  service: "Testing", Actions: "" },
        { sno: 4, client: "Michael Clark",  service: "Testing", Actions: "" },
        { sno: 5, client: "Sophia Martinez",  service: "Testing", Actions: "" },
        { sno: 6, client: "James Anderson",  service: "Testing", Actions: "" },
        { sno: 7, client: "Olivia Scott",  service: "Testing", Actions: "" },
        { sno: 8, client: "William Rodriguez",  service: "Testing", Actions: "" },
    ]);
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(15);
    const [filteredData, setFilteredData] = useState(tableData);
    const [formFields, setFormFields] = useState(CreateServiceFields);
    const [file, setFile] = useState(null);

    const columns = [
        { header: "S.No", accessor: "sno", editable: false },
        { header: "Client", accessor: "client", editable: false },
        { header: "Service", accessor: "service", editable: true },
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


    // Handle pagination
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Handle add class teacher
    const handleAdd = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const result = await Swal.fire({
            title: "Are you sure about add student ?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Add it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
        });
        if (result.isConfirmed) {
            try {
                // console.log("Selected form:", formData);
                // const { CLASS_ID, FATHER_NAME, NAME, contact, feegroupid, gender } = formData;
                // const payload = {
                //   studentname: NAME,
                //   fathername: FATHER_NAME,
                //   classid: CLASS_ID,
                //   gender: gender,
                //   feegroupid: feegroupid,
                //   contact: contact,
                //   yearid: year.YearId
                // }
                // const response = await addStudent(payload);
                // if (!response.data.status) {
                //   return Swal.fire("Error", response.data.message || "Failed to add student.", "error");
                // }
                // console.log("admission numberrr", response)
                // Swal.fire("Success", `Student added successfully with Admission No: ${response?.data?.data?.admissionNo}`, "success");
                // resetForm()
                // fetchViewClassStudData("All");
            } catch (err) {
                console.error("Error while get student data:", err.stack);
                Swal.fire("Error", err.response?.data?.message || "Failed to add student data.", "error");
            }
        }

    };

    // Handle delete class teacher
    const onDelete = useCallback(async (updatedData, index) => {

        console.log("update dataaa", updatedData, formData)

        const result = await Swal.fire({
            title: "Are you sure about switch student to inactive?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
        });
        if (result.isConfirmed) {
            try {
                // const payload = { student_id: updatedData.ADMISSION_ID, Year_Id: year.YearId };
                // const response = await deleteStudent(payload);
                if (response.data.status) {
                    // const newFilteredData = filteredData.filter(
                    //   (item, ind) => ind !== index
                    // ).map((item, ind) => ({ ...item, sno: ind + 1 }));
                    // console.log("newFilteredData", newFilteredData)
                    // setFilteredData(newFilteredData);

                    // const newTableData = tableData.filter(
                    //   (item, ind) => ind !== index
                    // ).map((item, ind) => ({ ...item, sno: ind + 1 }));
                    // console.log("newFilteredData", newTableData)
                    // setTableData(newTableData);
                    Swal.fire("Deleted!", response?.data?.message || "Student deleted successfully.", "success");
                }
            } catch (error) {
                Swal.fire("Error", error.response?.data?.message || "Failed to delete student.", "error");
            }

        }

    }, []);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await Swal.fire({
            title: "Are you sure about add student bulk upload?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Add it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
        });
        if (result.isConfirmed) {
            if (!file) {
                Swal.fire("Error", "Please select a file.", "error");
                return;
            }
            try {
                // const formData = new FormData();
                // formData.append("students", file);
                // formData.append(
                //   "yearid", year.YearId
                // );
                // const response = await bulkUpload(formData);
                // if (!response.data.status) {
                //   return Swal.fire("Error", response.data.message || "Failed to add student bulk upload.", "error");

                // }
                // Swal.fire("Success", "Student bulk upload added successfully!", "success");
                // fetchViewClassStudData("All");
            }
            catch (error) {
                console.error("Error while get student data:", error.stack);
                Swal.fire("Error", error.response?.data?.message || "Failed to add student bulk upload.", "error");
            }
        }


    }
    const onEdit = () => {

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
