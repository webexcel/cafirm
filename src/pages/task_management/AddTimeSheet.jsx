
import React, { Fragment, useCallback, useState, useEffect, Suspense } from "react";
import { Row, Col, Card, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import CustomForm from "../../components/custom/form/CustomForm";
import useForm from "../../hooks/useForm";
import validateCustomForm from "../../components/custom/form/ValidateForm";
import { AddTimeSheetField } from "../../constants/fields/taskFields";
import { getClient } from "../../service/client_management/createClientServices";
import { getEmployee } from "../../service/employee_management/createEmployeeService";
import { getService } from "../../service/masterDetails/serviceApi";
import CustomTable from "../../components/custom/table/CustomTable";
import Loader from "../../components/common/loader/loader";
import { addTask, getTasksByPriority } from "../../service/task_management/createTaskServices";


const AddTimeSheet = () => {

  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState(tableData);
  const [formFields, setFormFields] = useState(AddTimeSheetField);
  const [clientdata, setClientData] = useState([])
  const [servicedata, setServiceData] = useState([])
  const columns = [
    { header: "S No", accessor: "sno", editable: false },
    { header: "Task", accessor: "task_name", editable: false },
    // { header: "Client", accessor: "client_name", editable: false },
    { header: "Employee", accessor: "assigned_to", editable: false },
    { header: "Service", accessor: "service_name", editable: true },
    { header: "Start Date", accessor: "startdate", editable: true },
    { header: "End Date", accessor: "enddate", editable: true },
    { header: "Description", accessor: "description", editable: true },
    { header: "Priority", accessor: "priority", editable: true },
    // { header: "Actions", accessor: "Actions", editable: false },
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(15);
  // Initialize form state from field definitions
  const initialFormState = AddTimeSheetField.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {});

  const { formData, errors, handleInputChange, validateForm, resetForm } = useForm(
    initialFormState,
    (data) => validateCustomForm(data, AddTimeSheetField)
  );

  useEffect(() => {
    // Fetch field option data
    const fetchFieldOptionData = async () => {
      try {
        const clientresponse = await getClient();
        const serviceresponse = await getService()
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
              setClientData(clientOptions)
              return { ...field, options: clientOptions };

            } else {
              console.error("Client data response is not an array or is empty.");
            }

          }
          if (field.name === "service") {
            if (Array.isArray(serviceresponse.data.data) && serviceresponse.data.data.length > 0) {
              const serviceOptions = serviceresponse.data.data.map((item) => ({
                value: item.service_id,
                label: item.service_name,
              }));
              console.log("Mapped Client Options:", serviceOptions);
              setServiceData(serviceOptions)
              return { ...field, options: serviceOptions };
            } else {
              console.error("Service data response is not an array or is empty.");
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
    const getPriorityBased = async () => {
      try {
        const response = await getTasksByPriority()
        console.log("Priority based task data : ", response)
        const addSno = response?.data?.data.map((data, index) => ({
          ...data,
          sno: index + 1,
          startdate: data?.assigned_date.split('T')[0],
          enddate: data?.due_date.split('T')[0],
          assigned_to: data?.assigned_to.map((empdata) => ({ value: empdata.emp_id, label: empdata.emp_name }))
        }))
        setTableData(addSno)
        setFilteredData(addSno)
      }
      catch (error) {
        console.log("Error Occures while getting tasks by priority : ", error.stack)
      }
    }
    getPriorityBased()
  }, [])

  // Handle add
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const result = await Swal.fire({
      title: "Are you sure about create task ?",
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
        const { client, service, description, date, start_time, end_time, employee, priority, task } = formData;
        const clientval = clientdata.filter((data) => Number(data.value) === Number(client))
        const serviceval = servicedata.filter((data) => Number(data.value) === Number(service))
        const empIds = employee.map((data) => data.value)
        // const date1 = new Date()
        // const userData = JSON.parse(Cookies.get('user'));
        console.log("clientval", clientval)
        console.log("serviceval", serviceval)
        // console.log("employee", employee)
        const payload = {
          "client": clientval[0]?.value || '',
          "name": task || '',
          "service": serviceval[0].value || '',
          "assignTo": empIds,
          // "assignDate": start_time,
          // "dueDate": end_time,
          "assignDate": "2025-03-14",
          "dueDate": "2025-03-15",
          "priority": priority,
          "description": description
        }
        const response = await addTask(payload);
        if (!response.data.status) {
          return Swal.fire("Error", response.data.message || "Failed to add task.", "error");
        }
        Swal.fire("Success", `Task added successfully`, "success");
        resetForm()

      } catch (err) {
        console.error("Error while get timesheet data:", err.stack);
        Swal.fire("Error", err.response?.data?.message || "Failed to add timesheet data.", "error");
      }
    }

  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
                />

              </Col>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xl={12}>
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
                // onDelete={onDelete}
                />
              </Suspense>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default AddTimeSheet;
