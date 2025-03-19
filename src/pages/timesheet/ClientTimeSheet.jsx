

import React, { Fragment, useCallback, useState, useEffect, Suspense } from "react";
import { Row, Col, Card, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import CustomForm from "../../components/custom/form/CustomForm";
import Loader from "../../components/common/loader/loader";
import useForm from "../../hooks/useForm";
import validateCustomForm from "../../components/custom/form/ValidateForm";
import { getClient } from "../../service/client_management/createClientServices";
import { ViewCliTimeSheetField } from "../../constants/fields/timesheetFields";
import { getCliTimeSheet, viewCliTimeSheet } from "../../service/timesheet/clientTimeSheet";
import { deleteTimeSheet, editTimeSheet, getEmployeeByService, getServiceByClient, getTaskByEmployee, viewSelectTimeSheet } from "../../service/timesheet/employeeTimeSheet";
import CustomModalBox from "../task_management/model/custom/CustomModalBox";
import { TimesheetModalFields } from "../../constants/fields/ModelBoxFields";
const CustomTable = React.lazy(() =>
  import("../../components/custom/table/CustomTable")
);
import * as Yup from "yup";
import { getEmployee } from "../../service/employee_management/createEmployeeService";
import Cookies from 'js-cookie';


const ClientTimeSheet = () => {

  const [tableData, setTableData] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(15);
  const [filteredData, setFilteredData] = useState(tableData);
  const [formFields, setFormFields] = useState(ViewCliTimeSheetField);
  const [showModal, setShowModal] = useState(false);
  const [timesheetFormFileds, setTimesheetFormFields] = useState(TimesheetModalFields)
  const [initialModelValues, setInitialModelValues] = useState(
    TimesheetModalFields.reduce((values, field) => {
      values[field.name] = field.type === "dropdown" ? "" : field.type === "date" ? null : "";
      return values;
    }, {})
  );

  const validationSchema = Yup.object().shape(
    TimesheetModalFields.reduce((schema, field) => {
      if (field.required) {
        if (field.type === "dropdown") {
          schema[field.name] = Yup.string().required(`${field.label} is required`);
        } else if (field.type === "date") {
          schema[field.name] = Yup.date().nullable().required(`${field.label} is required`);
        } else {
          schema[field.name] = Yup.string().required(`${field.label} is required`);
        }
      }
      return schema;
    }, {})
  );

  const columns = [
    { header: "Sno", accessor: "sno", editable: false },
    { header: "Emp Name", accessor: "employee_name", editable: false },
    { header: "Client Name", accessor: "client_name", editable: false },
    { header: "Service", accessor: "service_name", editable: true },
    { header: "Task", accessor: "task_name", editable: true },
    { header: "Date", accessor: "date", editable: true },
    { header: "Total Mins", accessor: "total_minutes", editable: true },
    // { header: "Description", accessor: "descripition", editable: true },
    { header: "Actions", accessor: "Actions", editable: false },
  ];

  // Initialize form state from field definitions
  const initialFormState = ViewCliTimeSheetField.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {});

  const { formData, errors, handleInputChange, validateForm, resetForm, setFieldValue } = useForm(
    initialFormState,
    (data) => validateCustomForm(data, ViewCliTimeSheetField)
  );

  useEffect(() => {
    // Fetch field option data
    const fetchFieldOptionData = async () => {
      try {
        const payload = {
        };
        const clientresponse = await getClient();
        const employeeresponse = await getEmployee();
        console.log("Client API Response:", clientresponse);
        const updatedFormFields = ViewCliTimeSheetField.map((field) => {
          if (field.name === "client") {
            if (Array.isArray(clientresponse.data.data) && clientresponse.data.data.length > 0) {
              const clientOptions = clientresponse.data.data.map((item) => ({
                value: item.client_id,
                label: item.client_name,
              }));
              console.log("Mapped Client Options:", clientOptions);
              return { ...field, options: [{ value: "All", label: "All" }, ...clientOptions] };
            } else {
              console.error("Client data response is not an array or is empty.");
            }

          }

          if (field.name === "employee") {
            if (Array.isArray(employeeresponse.data.data) && employeeresponse.data.data.length > 0) {
              const userData = JSON.parse(Cookies.get('user'));
              if (userData?.role !== 'S') {
                setFieldValue("employee", userData.employee_id);
                console.log("userData111111111111111", userData);
              }
              console.log("userDatauserDatauserData", userData)
              const employeeOptions = employeeresponse.data.data.map((item) => ({
                value: item.employee_id,
                label: item.name,
              }));
              console.log("Mapped Employee Options:", userData, field,
                employeeOptions);
              return {
                ...field,
                options: employeeOptions,
                disabled: userData?.role !== 'S' ? true : false
              };
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

  const fetchViewTicketData = async (emp_id, client_id, service_id, startdate, enddate) => {
    try {
      const payload = {
        "emp_id": emp_id,
        "client_id": client_id,
        "service_id": service_id,
        "startdate": String(startdate).split('T')[0],
        "enddate": String(enddate).split('T')[0]
      }
      const response = await viewSelectTimeSheet(payload)
      const addSno = response?.data?.data.map((data, index) => ({
        sno: index + 1,
        ...data,
        date: String(data.date)?.split('T')[0] || '',
      }))
      setTableData(addSno)
      setFilteredData(addSno)
      resetForm()
      console.log("All Task records : ", response)
    }
    catch (error) {
      setTableData([])
      setFilteredData([])
      console.log("Error occurs while getting all task : ", error.stack)
    }
  }
  const date = new Date()
  useEffect(() => {
    fetchViewTicketData("All", "All", "All", date.toISOString().split('T')[0], date.toISOString().split('T')[0])
  }, [])

  useEffect(() => {

    if (formData.client) {
      const fetchClientOptionData = async () => {
        console.log('formm data', formData)
        try {
          const payload = {
            client_id: formData.client,
          };
          const serviceresponse = await getServiceByClient(payload);

          console.log("Service API Response:", serviceresponse.data.data);

          const updatedFormFields = await formFields.map((field) => {

            if (field.name === "service") {
              console.log('service', formFields)
              if (Array.isArray(serviceresponse.data.data) && serviceresponse.data.data.length > 0) {
                const serviceOptions = serviceresponse.data.data.map((item) => ({
                  value: item.service_id,
                  label: item.service_name,
                }));

                console.log('serviceOptions : ', [{ value: "All", label: "All" }, ...serviceOptions], formFields)
                return {
                  ...field,
                  options: [{ value: "All", label: "All" }, ...serviceOptions]
                };
              } else {
                console.error("Student data response is not an array or is empty.");

                return {
                  ...field,
                  options: [{ value: "All", label: "All" }]
                };
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

  // useEffect(() => {

  //   if (formData.service) {
  //     const fetchClientOptionData = async () => {
  //       console.log('formm data', formData)
  //       try {
  //         const payload = {
  //           "client_id": formData?.client || '',
  //           "service_id": formData?.service || ''
  //         };
  //         const employeeresponse = await getEmployeeByService(payload);

  //         console.log("Employee API Response:", employeeresponse.data.data);

  //         const updatedFormFields = await formFields.map((field) => {

  //           if (field.name === "employee") {
  //             console.log('employee', formFields)
  //             if (Array.isArray(employeeresponse.data.data) && employeeresponse.data.data.length > 0) {
  //               const employeeOptions = employeeresponse.data.data.map((item) => ({
  //                 value: item.employee_id,
  //                 label: item.name,
  //               }));

  //               console.log('employeeOptions : ', employeeOptions, formFields)
  //               return {
  //                 ...field,
  //                 options: [{ value: "All", label: 'All' }, ...employeeOptions]
  //               };
  //             } else {
  //               console.error("Student data response is not an array or is empty.");
  //               return {
  //                 ...field,
  //                 options: [{ value: "All", label: 'All' }]
  //               };
  //             }
  //           }
  //           return field;
  //         });
  //         setFormFields(updatedFormFields);
  //         console.log("Mapped Student Options:", formFields);

  //       } catch (error) {
  //         console.error("Error fetching Student data:", error);
  //       }
  //     };

  //     fetchClientOptionData();
  //   }
  // }, [formData.service]);

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
      const payload = {
        "emp_id": formData?.employee || "",
        "client_id": formData?.client || "",
        "service_id": formData?.service || "",
        "startdate": formData?.start_date || new Date(),
        "enddate": formData?.end_date || new Date()
      }
      const response = await viewSelectTimeSheet(payload);
      if (!response.data.status) {
        return Swal.fire("Error", response.data.message || "Failed to get timesheet.", "error");
      }
      const addSno = response.data.data.map((data, index) => ({
        ...data,
        sno: index + 1,
        date: data?.date?.split('T')[0] || data?.date || ""
      }))
      setTableData(addSno || [])
      setFilteredData(addSno || [])
    } catch (err) {
      setTableData([])
      setFilteredData([])
      console.error("Error while get client timesheet data:", err.stack);
      Swal.fire("Error", err.response?.data?.message || "Failed to get client timesheet data.", "error");
    }

  };

  const updateEmployeeOptions = async () => {
    const updatedFields = await Promise.all(
      timesheetFormFileds.map(async (data) => {
        if (data.name === "employee") {
          const employeedata = await getEmployee();
          console.log("employeeeee check : ", employeedata)
          return {
            ...data,
            options: employeedata.data.data.map((emp) => ({
              label: emp.name,
              value: emp.employee_id
            }))
          };
        }

        if (data.name === "taskName") {
          const payload = {}
          const taskdata = await getTaskByEmployee(payload);
          console.log("task checkk : ", taskdata)
          return {
            ...data,
            options: taskdata.data.data.map((emp) => ({
              label: emp.task_name,
              value: emp.task_id
            }))
          };
        }
        return data;
      })
    );
    console.log("updatedFields", updatedFields)
    setTimesheetFormFields(updatedFields);
  }

  const handlerEdit = (data, index) => {
    console.log("dataaaa", data, index, timesheetFormFileds, initialModelValues)
    updateEmployeeOptions()
    console.log("dataaaa", data, index, timesheetFormFileds, timesheetFormFileds)
    const date1 = new Date()
    setInitialModelValues((prev) => ({
      ...prev,
      taskName: String(data?.task_id || ""),
      employee: String(data?.employee_id) || "",
      client: data?.client || "",
      service: data?.service || "",
      service: data?.service_name || '',
      client: data?.client_name || '',
      date: data?.date || date1,
      minutes: data?.total_minutes || '',
      time_sheet_id: data?.time_sheet_id || ''
    }))

    setShowModal(true)
  }

  const handleSubmit = async (values) => {
    console.log("Submitted values:", values);
    try {
      const payload = {
        "ts_id": values?.time_sheet_id || '',
        "date": values?.date || '',
        "totalMinutes": values?.minutes || '',
        "description": ""
      }
      const response = await editTimeSheet(payload)
      if (!response.data.status) {
        return Swal.fire("Error", response.data.message || "Failed to edit timesheet.", "error");
      }
      Swal.fire("Success", `Timesheet edit successfully`, "success");
    }
    catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to edit timesheet.", "error");
      console.log("Error occurs edit timesheet data : ", err.stack)
    }
    setShowModal(false);
  };

  const onDelete = useCallback(async (updatedData, index) => {
    console.log("update dataaa", updatedData)
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
        const response = await deleteTimeSheet(payload);
        if (response.data.status) {
          setFilteredData((prevFilteredData) =>
            prevFilteredData
              .filter((item, ind) => ind !== index)
              .map((item, ind) => ({ ...item, sno: ind + 1 }))
          );

          setTableData((prevTableData) =>
            prevTableData
              .filter((item, ind) => ind !== index)
              .map((item, ind) => ({ ...item, sno: ind + 1 }))
          );

          Swal.fire("Deleted!", response?.data?.message || "Timesheet deleted successfully.", "success");
        }
      } catch (error) {
        Swal.fire("Error", error.response?.data?.message || "Failed to delete time sheet.", "error");
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
              handlerEdit={handlerEdit}
            />
          </Suspense>
        </Card.Body>
      </Card>

      <CustomModalBox
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleSubmit={handleSubmit}
        initialValues={initialModelValues}
        validationSchema={validationSchema}
        formFields={timesheetFormFileds}
      />
    </Fragment>
  );
};

export default ClientTimeSheet;
