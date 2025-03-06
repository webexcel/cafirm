
import React, { Fragment, useCallback, useState, useEffect, Suspense } from "react";
import { Row, Col, Card, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import CustomForm from "../../components/custom/form/CustomForm";
import Loader from "../../components/common/loader/loader";
import useForm from "../../hooks/useForm";
import validateCustomForm from "../../components/custom/form/ValidateForm";
import { AddTimeSheetField } from "../../constants/fields/taskFields";
import { addTimesheet, deleteTimesheet, getTimesheet } from "../../service/client_management/addTimeSheet";
import { getClient } from "../../service/client_management/createClientServices";
import { getEmployee } from "../../service/employee_management/createEmployeeService";
import { getTimeDifferenceInMinutes } from "../../utils/generalUtils";
const CustomTable = React.lazy(() =>
  import("../../components/custom/table/CustomTable")
);


const AddTimeSheet = () => {

  const [tableData, setTableData] = useState([
    { sno: 1, name: "Alice Johnson", service: "Auditing", date: "20/10/2025", hours: "5", desc: "", Actions: "" },
    { sno: 2, name: "David Brown", service: "Auditing", date: "22/10/2025", hours: "4", desc: "", Actions: "" },
    { sno: 3, name: "Emma Wilson", service: "Auditing", date: "23/10/2025", hours: "2", desc: "", Actions: "" },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(15);
  const [filteredData, setFilteredData] = useState(tableData);
  const [formFields, setFormFields] = useState(AddTimeSheetField);
  const columns = [
    { header: "Client ID", accessor: "sno", editable: false },
    { header: "Name", accessor: "name", editable: false },
    { header: "Service", accessor: "service", editable: true },
    { header: "Date", accessor: "date", editable: true },
    { header: "Hours", accessor: "hours", editable: true },
    { header: "Description", accessor: "descripition", editable: true },
    { header: "Actions", accessor: "Actions", editable: false },
  ];

  // Initialize form state from field definitions
  const initialFormState = AddTimeSheetField.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {});

  const { formData, errors, handleInputChange, validateForm, resetForm } = useForm(
    initialFormState,
    (data) => validateCustomForm(data, AddTimeSheetField)
  );

  const getTimeSheetData = async () => {
    try {
      const response = await getTimesheet()
      const addSno = response.data.data.map((data, index) => ({
        ...data,
        sno: index + 1,
        date: data?.date?.split('T')[0] || data?.date || ""
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
    // Fetch field option data
    const fetchFieldOptionData = async () => {
      try {
        const clientresponse = await getClient();
        const employeeresponse = await getEmployee();
        console.log("Client API Response:", clientresponse);
        console.log("Employee API Response:", employeeresponse);

        const updatedFormFields = AddTimeSheetField.map((field) => {
          if (field.name === "client") {
            if (Array.isArray(clientresponse.data.data) && clientresponse.data.data.length > 0) {
              const clientOptions = clientresponse.data.data.map((item) => ({
                value: item.client_id,
                label: item.client_name,
              }));
              console.log("Mapped Client Options:", clientOptions);
              return { ...field, options: clientOptions };
            } else {
              console.error("Client data response is not an array or is empty.");
            }

          }
          if (field.name === "employee") {
            if (Array.isArray(employeeresponse.data.data) && employeeresponse.data.data.length > 0) {
              const employeeOptions = employeeresponse.data.data.map((item) => ({
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
      } catch (error) {
        console.error("Error fetching class data:", error);
      }
    };
    fetchFieldOptionData()
  }, []);

  useEffect(() => {
    getTimeSheetData()
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
      title: "Are you sure about add timesheet ?",
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
        const { client, service, description, date, start_time, end_time, employee } = formData;
        const payload = {
          "id": employee,
          "clientId": client,
          "serviceId": service,
          "date": date,
          "totalMinutes": getTimeDifferenceInMinutes(start_time, end_time),
          "description": description
        }
        const response = await addTimesheet(payload);
        if (!response.data.status) {
          return Swal.fire("Error", response.data.message || "Failed to add timesheet.", "error");
        }
        Swal.fire("Success", `Timesheet added successfully`, "success");
        resetForm()
        getTimeSheetData();
      } catch (err) {
        console.error("Error while get timesheet data:", err.stack);
        Swal.fire("Error", err.response?.data?.message || "Failed to add timesheet data.", "error");
      }
    }

  };

  // Handle delete class teacher
  const onDelete = useCallback(async (updatedData, index) => {

    console.log("update dataaa", updatedData, formData)

    const result = await Swal.fire({
      title: "Are you sure about delete timesheet?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      try {
        const payload = { id: updatedData.time_sheet_id };
        const response = await deleteTimesheet(payload);
        if (response.data.status) {
          const newFilteredData = filteredData.filter(
            (item, ind) => ind !== index
          ).map((item, ind) => ({ ...item, sno: ind + 1 }));
          console.log("newFilteredData", newFilteredData)
          setFilteredData(newFilteredData);

          const newTableData = tableData.filter(
            (item, ind) => ind !== index
          ).map((item, ind) => ({ ...item, sno: ind + 1 }));
          console.log("newFilteredData", newTableData)
          setTableData(newTableData);
          Swal.fire("Deleted!", response?.data?.message || "Timesheet deleted successfully.", "success");
        }
      } catch (error) {
        Swal.fire("Error", error.response?.data?.message || "Failed to delete timesheet.", "error");
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

export default AddTimeSheet;
