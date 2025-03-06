
import React, { Fragment, useCallback, useState, useEffect, Suspense } from "react";
import { Row, Col, Card, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import CustomForm from "../../components/custom/form/CustomForm";
import Loader from "../../components/common/loader/loader";
import useForm from "../../hooks/useForm";
import validateCustomForm from "../../components/custom/form/ValidateForm";
import { AddEmployeeField } from "../../constants/fields/employeeFields";
import { addEmployee, deleteEmployee, getEmployee } from "../../service/employee_management/createEmployeeService";
const CustomTable = React.lazy(() =>
  import("../../components/custom/table/CustomTable")
);


const CreateEmployee = () => {
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(15);
  const [filteredData, setFilteredData] = useState(tableData);
  const [formFields, setFormFields] = useState(AddEmployeeField);

  const columns = [
    { header: "Emp ID", accessor: "employee_id", editable: false },
    { header: "Name", accessor: "name", editable: false },
    { header: "Role", accessor: "role", editable: true },
    { header: "Email", accessor: "email", editable: true },
    { header: "Phone No", accessor: "phone", editable: true },
    { header: "Actions", accessor: "Actions", editable: false },
  ];


  // Initialize form state from field definitions
  const initialFormState = AddEmployeeField.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {});

  const { formData, errors, handleInputChange, validateForm, resetForm } = useForm(
    initialFormState,
    (data) => validateCustomForm(data, AddEmployeeField)
  );
  const getEmployeeData = async () => {
    try {
      const response = await getEmployee()
      const addSno = response.data.data.map((data, index) => ({
        sno: index + 1,
        ...data
      }))
      setTableData(addSno)
      setFilteredData(addSno)
      console.log("response : ", response)
    }
    catch (err) {
      console.log("Error occurs while getting employee data : ", err)
    }
  }

  useEffect(() => {
    getEmployeeData()
  }, [])


  // Handle pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle add class teacher
  const handleAdd = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const result = await Swal.fire({
      title: "Are you sure about add employee ?",
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
        const { name, emprole, email, password, phone } = formData;
        const payload = {
          "name": name,
          "email": email,
          "password": password,
          "phone": phone,
          "role": emprole
        }

        const response = await addEmployee(payload);
        if (!response.data.status) {
          return Swal.fire("Error", response.data.message || "Failed to add employee.", "error");
        }
        console.log("admission numberrr", response)
        Swal.fire("Success", `Employee added successfully with Employee`, "success");
        resetForm()
        getEmployeeData()
      } catch (err) {
        console.error("Error while get employee data:", err.stack);
        Swal.fire("Error", err.response?.data?.message || "Failed to add employee data.", "error");
      }
    }

  };

  // Handle delete class teacher
  const onDelete = useCallback(async (updatedData, index) => {

    console.log("update dataaa", updatedData, formData)

    const result = await Swal.fire({
      title: "Are you sure about remove employee?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      try {
        console.log("update dataa", updatedData)
        const payload = { id: updatedData?.employee_id || '' };
        const response = await deleteEmployee(payload);
        if (response.data.status) {
          const newFilteredData = filteredData
            .filter((item, ind) => ind !== index)
            .map((item, ind) => ({ ...item, sno: ind + 1 }));
          setFilteredData(newFilteredData);
          setTableData(newFilteredData);
          Swal.fire("Deleted!", response?.data?.message || "Employee deleted successfully.", "success");
        }
      } catch (error) {
        Swal.fire("Error", error.response?.data?.message || "Failed to delete employee.", "error");
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

export default CreateEmployee;
