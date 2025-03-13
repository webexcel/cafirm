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
import { getEmpTimeSheet, getServiceByClient, getTimeSheetService, viewEmpTimeSheet } from "../../service/timesheet/employeeTimeSheet";
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
    { header: "Description", accessor: "descripition", editable: true },
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

  const getEmpTimeSheetData = async () => {
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

    if (formData.client) {
      const fetchClientOptionData = async () => {
        console.log('formm data', formData)
        try {
          const payload = {
            client_id: formData.client,
          };
          const clientresponse = await getServiceByClient(payload);

          console.log("Client API Response:", clientresponse.data.data);

          // const updatedFormFields = await formFields.map((field) => {

          //   if (field.name === "studentMapping") {
          //     console.log('testt', formFields)
          //     if (Array.isArray(clientresponse.data.data) && clientresponse.data.data.length > 0) {
          //       const studentOptions = clientresponse.data.data.map((item) => ({
          //         value: item.Admission_No,
          //         label: item.NAME,
          //       }));

          //       console.log('student optionnnnnnnnnnnnn', studentOptions)
          //       return {
          //         ...field,
          //         options: {
          //           ...field.options,
          //           available: studentOptions
          //         }
          //       };
          //     } else {
          //       console.error("Student data response is not an array or is empty.");
          //     }
          //   }
          //   return field;
          // });
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
    getEmpTimeSheetData()
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
        "emp_id": employee,
        "start_date": start_date,
        "end_date": end_date,
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
