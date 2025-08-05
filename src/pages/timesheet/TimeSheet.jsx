import React, { Fragment, useCallback, useState, useEffect, Suspense } from "react";
import { Row, Col, Card, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import CustomForm from "../../components/custom/form/CustomForm";
import Loader from "../../components/common/loader/loader";
import useForm from "../../hooks/useForm";
import validateCustomForm from "../../components/custom/form/ValidateForm";
import { getClient } from "../../service/client_management/createClientServices";
import { ViewEmpTimeSheetField } from "../../constants/fields/timesheetFields";
import { addTimeSheet, getTaskByEmployee, getTimeSheetService, } from "../../service/timesheet/employeeTimeSheet";
const CustomTable = React.lazy(() =>
  import("../../components/custom/table/CustomTable")
);
import Cookies from 'js-cookie';
import { getEmployeesByPermission } from "../../service/employee_management/viewEditEmployeeService";
import { usePermission } from "../../contexts";
import OverlayLoader from "../../components/common/loader/OverlayLoader";

const AddTimeSheet = () => {

  const [tableData, setTableData] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(15);
  const [filteredData, setFilteredData] = useState(tableData);
  const [formFields, setFormFields] = useState(ViewEmpTimeSheetField);
  const { permissions, getOperationFlagsById } = usePermission();
  const [permissionFlags, setPermissionFlags] = useState(1);
  const [selectedTaskLimits, setSelectedTaskLimits] = useState({
    start: '',
    end: ''
  })
  const [loader, setLoader] = useState(false)
  const columns = [
    { header: "S No", accessor: "sno", editable: false },
    { header: "Emp Name", accessor: "employee_name", editable: false },
    { header: "Task Name", accessor: "task_name", editable: false },
    { header: "Fin Year", accessor: "year_name", editable: true },
    { header: "Date", accessor: "date", editable: true },
    { header: "Total Time", accessor: "total_time", editable: true },
    // { header: "Actions", accessor: "Actions", editable: false },
  ];

  // Initialize form state from field definitions
  const initialFormState = ViewEmpTimeSheetField.reduce((acc, field) => {

    acc[field.name] = "";
    return acc;
  }, {});

  const { formData, errors, handleInputChange, validateForm, resetForm, setFieldValue } = useForm(
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
        const userData = JSON.parse(Cookies.get('user'));
        const payload = {
          emp_id: userData?.employee_id
        };
        const clientresponse = await getClient();
        const employeeresponse = await getEmployeesByPermission(payload);
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

          if (field.name === "employee") {
            console.log("Inner.....")
            if (Array.isArray(employeeresponse.data.data) && employeeresponse.data.data.length > 0) {
              if (employeeresponse.data.data.length === 1) {
                setFieldValue("employee", employeeresponse.data.data[0].employee_id);
                // console.log("userData111111111111111", employeeresponse.data.data);
              }
              const employeeOptions = employeeresponse.data.data.map((item) => ({
                value: item.employee_id,
                label: item.name,
              }));
              console.log("Mapped Employee :", field,
                employeeOptions);
              return {
                ...field,
                options: employeeOptions,
                disabled: employeeresponse.data.data.length === 1 ? true : false
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


  useEffect(() => {
    console.log("Mapped Student Options:", formFields);
  }, [formFields]);


  useEffect(() => {

    if (formData.employee) {
      setLoader(true)
      const fetchClientOptionData = async () => {
        console.log('formm data', formData)
        try {
          const payload = {
            "client_id": Number(formData?.client) || '',
            "service_id": Number(formData?.service) || '',
            "emp_id": Number(formData?.employee) || ''
          };
          const employeeresponse = await getTaskByEmployee(payload);

          console.log("Task API Response:", employeeresponse.data.data);
          const updatedFormFields = await formFields.map((field) => {

            if (field.name === "task") {
              console.log('task', formFields)
              if (Array.isArray(employeeresponse.data.data) && employeeresponse.data.data.length > 0) {
                const employeeOptions = employeeresponse.data.data.map((item) => ({
                  value: item.task_id,
                  label: (
                    <>
                      {item.task_name} - <p style={{ display: "inline" }} className="text-primary fw-bold">{item.year_name}</p>
                    </>
                  )
                }));

                console.log('employeeOptions : ', employeeOptions, formFields)
                setLoader(false) 
                return {
                  ...field,
                  options: employeeOptions
                };
              } else {
                setLoader(false)
                console.error("Student data response is not an array or is empty.");
              }
            }
            return field;
          });
          setFormFields(updatedFormFields);
          console.log("Mapped Student Options:", formFields);

        } catch (error) {
          setLoader(false)
          console.error("Error fetching Student data:", error);
        }
      };

      fetchClientOptionData();
    }
  }, [formData.employee]);


  useEffect(() => {
    getTimeSheetData()
    const permissionFlags = getOperationFlagsById(13, 1); // paren_id , sub_menu id
    console.log(permissionFlags, '---permissionFlags');
    setPermissionFlags(permissionFlags);

  }, [])

  // Handle pagination
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle add
  const handleAdd = async (e) => {
    console.log("Selected form:", formData);
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
        const payload = {
          "emp_id": formData?.employee || '',
          "task_id": formData?.task || '',
          "date": formData?.date || new Date(),
          // "totalMinutes": getTimeDifferenceInMinutes(formData?.start_time, formData?.end_time)
          time: formData?.time || ''
        }
        const response = await addTimeSheet(payload);
        getTimeSheetData()
        if (!response.data.status) {
          return Swal.fire("Error", response.data.message || "Failed to get employee timesheet.", "error");
        }
        Swal.fire("Success", `Timesheet added successfully`, "success");
        Object.keys(formData)
          .filter(k => k !== "employee")
          .forEach(item => setFieldValue(item, ""));
      } catch (err) {
        console.error("Error while get employee timesheet data:", err.stack);
        Swal.fire("Error", err.response?.data?.message || "Failed to get employee timesheet data.", "error");
      }
    }

  };

  return (
    <Fragment>
      <OverlayLoader loading={loader} />
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
                  showAddButton={true}
                  // showAddButton={permissionFlags?.showCREATE}
                  // showUpdateButton={permissionFlags?.showUPDATE}
                  showUpdateButton={true}
                  dateLimits={selectedTaskLimits}
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
              showDeleteButton={permissionFlags?.showDELETE}
              showUpdateButton={permissionFlags?.showUPDATE}
            // onDelete={onDelete}
            />
          </Suspense>
        </Card.Body>
      </Card>
    </Fragment>
  );
};

export default AddTimeSheet;
