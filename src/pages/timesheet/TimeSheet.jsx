import React, { Fragment, useCallback, useState, useEffect, Suspense } from "react";
import { Row, Col, Card, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import CustomForm from "../../components/custom/form/CustomForm";
import Loader from "../../components/common/loader/loader";
import useForm from "../../hooks/useForm";
import validateCustomForm from "../../components/custom/form/ValidateForm";
import { getClient } from "../../service/client_management/createClientServices";
import { getEmployee } from "../../service/employee_management/createEmployeeService";
import { ViewEmpTimeSheetField } from "../../constants/fields/timesheetFields";
import { getEmployeeByService, getEmpTimeSheet, getServiceByClient, getTaskByEmployee, getTimeSheetService, } from "../../service/timesheet/employeeTimeSheet";
const CustomTable = React.lazy(() =>
  import("../../components/custom/table/CustomTable")
);


const AddTimeSheet = () => {

  const [tableData, setTableData] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(15);
  const [filteredData, setFilteredData] = useState(tableData);
  const [formFields, setFormFields] = useState(ViewEmpTimeSheetField);
  const columns = [
    { header: "S No", accessor: "sno", editable: false },
    { header: "Emp Name", accessor: "employee_name", editable: false },
    { header: "Client Name", accessor: "client_name", editable: false },
    { header: "Service", accessor: "service_name", editable: true },
    { header: "Date", accessor: "date", editable: true },
    { header: "Total Mins", accessor: "total_minutes", editable: true },
    { header: "Actions", accessor: "Actions", editable: false },
  ];

  // Initialize form state from field definitions
  const initialFormState = ViewEmpTimeSheetField.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {});

  const { formData, errors, handleInputChange, validateForm, resetForm } = useForm(
    initialFormState,
    (data) => validateCustomForm(data, ViewEmpTimeSheetField)
  );

  const getTimeSheetData = async () => {
    try {
      const response = await getTimeSheetService()
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

        const updatedFormFields = ViewEmpTimeSheetField.map((field) => {

          if (field.name === "client") {
            if (Array.isArray(clientresponse.data.data) && clientresponse.data.data.length > 0) {
              const clientOption = clientresponse.data.data.map((item) => ({
                value: item.client_id,
                label: item.client_name,
              }));
              console.log("Mapped Employee Options:", clientOption);
              return { ...field, options: clientOption };
            } else {
              console.error("Employee data response is not an array or is empty.");
            }

          }

          // if (field.name === "employee") {
          //   if (Array.isArray(employeeresponse.data.data) && employeeresponse.data.data.length > 0) {
          //     const employeeOptions = employeeresponse.data.data.map((item) => ({
          //       value: item.employee_id,
          //       label: item.name,
          //     }));
          //     console.log("Mapped Employee Options:", employeeOptions);
          //     return { ...field, options: employeeOptions };
          //   } else {
          //     console.error("Employee data response is not an array or is empty.");
          //   }

          // }

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

    if (formData.client) {
      const fetchClientOptionData = async () => {
        console.log('formm data', formData)
        try {
          const payload = {
            client_id: formData.client,
          };
          const serviceresponse = await getServiceByClient(payload);

          console.log("Client API Response:", serviceresponse.data.data);

          const updatedFormFields = await formFields.map((field) => {

            if (field.name === "service") {
              console.log('service', formFields)
              if (Array.isArray(serviceresponse.data.data) && serviceresponse.data.data.length > 0) {
                const serviceOptions = serviceresponse.data.data.map((item) => ({
                  value: item.service_id,
                  label: item.service_name,
                }));

                console.log('serviceOptions : ', serviceOptions, formFields)
                return {
                  ...field,
                  options: serviceOptions
                };
              } else {
                console.error("Student data response is not an array or is empty.");
              }
            }
            return field;
          });
          setFormFields(updatedFormFields);
          console.log("Mapped Student Options:", formFields);

        } catch (error) {
          console.error("Error fetching Student data:", error);
        }
      };

      fetchClientOptionData();
    }
  }, [formData.client]);

  useEffect(() => {

    if (formData.service) {
      const fetchClientOptionData = async () => {
        console.log('formm data', formData)
        try {
          const payload = {
            "client_id": formData?.client || '',
            "service_id": formData?.service || ''
          };
          const employeeresponse = await getEmployeeByService(payload);

          console.log("Employee API Response:", employeeresponse.data.data);

          const updatedFormFields = await formFields.map((field) => {

            if (field.name === "employee") {
              console.log('employee', formFields)
              if (Array.isArray(employeeresponse.data.data) && employeeresponse.data.data.length > 0) {
                const employeeOptions = employeeresponse.data.data.map((item) => ({
                  value: item.employee_id,
                  label: item.name,
                }));

                console.log('employeeOptions : ', employeeOptions, formFields)
                return {
                  ...field,
                  options: [{ value: 'All', label: 'All' }, ...employeeOptions]
                };
              } else {
                console.error("Student data response is not an array or is empty.");
              }
            }
            return field;
          });
          setFormFields(updatedFormFields);
          console.log("Mapped Student Options:", formFields);

        } catch (error) {
          console.error("Error fetching Student data:", error);
        }
      };

      fetchClientOptionData();
    }
  }, [formData.service]);

  useEffect(() => {

    if (formData.employee) {
      const fetchClientOptionData = async () => {
        console.log('formm data', formData)
        try {
          const payload = {
            // "client_id": formData?.client || '',
            // "service_id": formData?.service || '',
            // "emp_id": formData?.employee || ''
            "client_id": 1,
            "service_id": 1,
            "emp_id": 1
          };
          const employeeresponse = await getTaskByEmployee(payload);

          console.log("Task API Response:", employeeresponse.data.data);

          const updatedFormFields = await formFields.map((field) => {

            if (field.name === "task") {
              console.log('task', formFields)
              if (Array.isArray(employeeresponse.data.data) && employeeresponse.data.data.length > 0) {
                const employeeOptions = employeeresponse.data.data.map((item) => ({
                  value: item.task_id,
                  label: item.task_name,
                }));

                console.log('employeeOptions : ', employeeOptions, formFields)
                return {
                  ...field,
                  options: employeeOptions
                };
              } else {
                console.error("Student data response is not an array or is empty.");
              }
            }
            return field;
          });
          setFormFields(updatedFormFields);
          console.log("Mapped Student Options:", formFields);

        } catch (error) {
          console.error("Error fetching Student data:", error);
        }
      };

      fetchClientOptionData();
    }
  }, [formData.employee]);

  useEffect(() => {

    if (formData.service) {
      const fetchClientOptionData = async () => {
        console.log('formm data', formData)
        try {
          const payload = {
            "client_id": formData?.client || '',
            "service_id": formData?.service || ''
          };
          const employeeresponse = await getEmployeeByService(payload);

          console.log("Employee API Response:", employeeresponse.data.data);

          const updatedFormFields = await formFields.map((field) => {

            if (field.name === "employee") {
              console.log('employee', formFields)
              if (Array.isArray(employeeresponse.data.data) && employeeresponse.data.data.length > 0) {
                const employeeOptions = employeeresponse.data.data.map((item) => ({
                  value: item.employee_id,
                  label: item.name,
                }));

                console.log('employeeOptions : ', employeeOptions, formFields)
                return {
                  ...field,
                  options: employeeOptions
                };
              } else {
                console.error("Student data response is not an array or is empty.");
              }
            }
            return field;
          });
          setFormFields(updatedFormFields);
          console.log("Mapped Student Options:", formFields);

        } catch (error) {
          console.error("Error fetching Student data:", error);
        }
      };

      fetchClientOptionData();
    }
  }, [formData.service]);

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
    try {
      console.log("Selected form:", formData);
      const { start_date, end_date, employee } = formData;
      const payload = {
        // "emp_id": employee,
        // "start_date": start_date,
        // "end_date": end_date,
        // "emp_id": 1,
        "clientId": 1,
        "serviceId": 2,
        "task_id": 19,
        "date": "2025-03-06",
        "totalMinutes": 60
      }
      const response = await getEmpTimeSheet(payload);
      if (!response.data.status) {
        return Swal.fire("Error", response.data.message || "Failed to get employee timesheet.", "error");
      }
      const addSno = response.data.data.map((data, index) => ({
        ...data,
        sno: index + 1,
        date: data?.date?.split('T')[0] || data?.date || ""
      }))
      setTableData(addSno)
      setFilteredData(addSno)
    } catch (err) {
      console.error("Error while get employee timesheet data:", err.stack);
      Swal.fire("Error", err.response?.data?.message || "Failed to get employee timesheet data.", "error");
    }

  };

  const onDelete = () => {
    console.log("On delete")
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
                  btnText={'Submit'}
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
