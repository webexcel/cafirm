
import React, { Fragment, useCallback, useState, useEffect, Suspense } from "react";
import { Row, Col, Card, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import CustomForm from "../../components/custom/form/CustomForm";
import Loader from "../../components/common/loader/loader";
import useForm from "../../hooks/useForm";
import validateCustomForm from "../../components/custom/form/ValidateForm";
import { CreateUserAccountFields } from "../../constants/fields/employeeFields";
const CustomTable = React.lazy(() =>
  import("../../components/custom/table/CustomTable")
);


const CreateUserAccount = () => {
  const [tableData, setTableData] = useState([
    { sno: 1, name: "Alice Johnson", role: "Admin", email: "alice@example.com", phone_number: "9876543210", Actions: "" },
    { sno: 2, name: "David Brown", role: "Admin", email: "david@example.com", phone_number: "9123456789", Actions: "" },
    { sno: 3, name: "Emma Wilson", role: "Admin", email: "emma@example.com", phone_number: "9988776655", Actions: "" },
    { sno: 4, name: "Michael Clark", role: "Admin", email: "michael@example.com", phone_number: "8765432109", Actions: "" },
    { sno: 5, name: "Sophia Martinez", role: "Admin", email: "sophia@example.com", phone_number: "9345678123", Actions: "" },
    { sno: 6, name: "James Anderson", role: "Admin", email: "james@example.com", phone_number: "9456781234", Actions: "" },
    { sno: 7, name: "Olivia Scott", role: "Admin", email: "olivia@example.com", phone_number: "9567812345", Actions: "" },
    { sno: 8, name: "William Rodriguez", role: "Admin", email: "william@example.com", phone_number: "9678123456", Actions: "" },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(15);
  const [filteredData, setFilteredData] = useState(tableData);
  const [formFields, setFormFields] = useState(CreateUserAccountFields);
  const [file, setFile] = useState(null);

  const columns = [
    { header: "Emp ID", accessor: "sno", editable: false },
    { header: "Name", accessor: "name", editable: false },
    { header: "Role", accessor: "role", editable: true },
    { header: "Email", accessor: "email", editable: true },
    { header: "Phone No", accessor: "phone_number", editable: true },
    { header: "Actions", accessor: "Actions", editable: false },
  ];


  // Initialize form state from field definitions
  const initialFormState = CreateUserAccountFields.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {});

  const { formData, errors, handleInputChange, validateForm, resetForm } = useForm(
    initialFormState,
    (data) => validateCustomForm(data, CreateUserAccountFields)
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

export default CreateUserAccount;
