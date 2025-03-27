import React, { Fragment, useCallback, useState, useEffect, Suspense } from "react";
import { Row, Col, Card } from "react-bootstrap";
import Swal from "sweetalert2";
import CustomForm from "../../components/custom/form/CustomForm";
import Loader from "../../components/common/loader/loader";
import useForm from "../../hooks/useForm";
import validateCustomForm from "../../components/custom/form/ValidateForm";
import { CreateUserAccountFields } from "../../constants/fields/employeeFields";
import { addEmployee, deleteEmployee, getEmployee } from "../../service/employee_management/createEmployeeService";
import { getEmployeesNotPassword, getUserAccounts, updatePassword } from "../../service/employee_management/UserAccountService";

const CustomTable = React.lazy(() => import("../../components/custom/table/CustomTable"));

const CreateUserAccount = () => {
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(15);
  const [filteredData, setFilteredData] = useState([]);
  const [formFields, setFormFields] = useState(CreateUserAccountFields);

  const columns = [
    { header: "Emp ID", accessor: "employee_id", editable: false },
    { header: "Name", accessor: "name", editable: false },
    { header: "Role", accessor: "role", editable: true },
    { header: "Email", accessor: "email", editable: true },
    { header: "Phone No", accessor: "phone", editable: true },
    { header: "Actions", accessor: "Actions", editable: false },
  ];

  const initialFormState = CreateUserAccountFields.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {});

  const { formData, errors, handleInputChange, validateForm, resetForm } = useForm(
    initialFormState,
    (data) => validateCustomForm(data, CreateUserAccountFields)
  );

  const getEmployeeData = async () => {
    try {
      const response = await getEmployeesNotPassword();
      const updatedFormFields = CreateUserAccountFields.map((field) => {
        if (field.name === "employee") {
          if (Array.isArray(response.data.data) && response.data.data.length > 0) {
            const employeeOptions = response.data.data.map((item) => ({
              value: item.employee_id,
              label: item.name,
            }));
            console.log("Mapped Employee Options:", employeeOptions);
            return { ...field, options: employeeOptions };
          } else {
            console.error("Employee data response is not an array or is empty.");
          }

        }
        return field;
      });
      setFormFields(updatedFormFields);
    } catch (err) {
      console.error("Error fetching employee data:", err);
    }
  };
  const getEmployeeTableData = async () => {
    try {
      const response = await getUserAccounts()
      const formattedData = response.data.data.map((data, index) => ({
        sno: index + 1,
        ...data,
      }));
      setTableData(formattedData);
      setFilteredData(formattedData);
    }
    catch (error) {
      console.log("Error occurs while getting employee table data : ", error.stack)
    }
  }

  useEffect(() => {
    const fetchInitial = async () => {
      await Promise.all([getEmployeeData(), getEmployeeTableData()]);
    };
    fetchInitial();
  }, []);


  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await Swal.fire({
      title: "Are you sure you want to add this employee?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, add it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const { password, employee, emprole } = formData;
        console.log(formData, '---formData');

        const payload = { password: password, id: employee, role: emprole };
        const response = await updatePassword(payload);

        if (!response.data.status) {
          return Swal.fire("Error", response.data.message || "Failed to add employee.", "error");
        }

        Swal.fire("Success", "Employee added successfully.", "success");
        resetForm();
        getEmployeeTableData();
      } catch (err) {
        Swal.fire("Error", err.response?.data?.message || "Failed to add employee.", "error");
      }
    }
  };

  const onDelete = useCallback(async (updatedData, index) => {
    const result = await Swal.fire({
      title: "Are you sure you want to delete this employee?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const payload = { id: updatedData?.employee_id || "" };
        const response = await deleteEmployee(payload);

        if (response.data.status) {
          setFilteredData((prevData) => {
            const newFilteredData = prevData.filter((item, ind) => ind !== index).map((item, ind) => ({ ...item, sno: ind + 1 }));
            setTableData(newFilteredData);
            return newFilteredData;
          });

          Swal.fire("Deleted!", "Employee deleted successfully.", "success");
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

export default CreateUserAccount;