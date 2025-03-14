

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
const CustomTable = React.lazy(() =>
  import("../../components/custom/table/CustomTable")
);


const ClientTimeSheet = () => {

  const [tableData, setTableData] = useState([])
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(15);
  const [filteredData, setFilteredData] = useState(tableData);
  const [formFields, setFormFields] = useState(ViewCliTimeSheetField);
  const columns = [
    { header: "Client ID", accessor: "sno", editable: false },
    { header: "Name", accessor: "employee", editable: false },
    { header: "Service", accessor: "service", editable: true },
    { header: "Date", accessor: "date", editable: true },
    { header: "Total Mins", accessor: "total_minutes", editable: true },
    { header: "Description", accessor: "descripition", editable: true },
    { header: "Actions", accessor: "Actions", editable: false },
  ];

  // Initialize form state from field definitions
  const initialFormState = ViewCliTimeSheetField.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {});

  const { formData, errors, handleInputChange, validateForm, resetForm } = useForm(
    initialFormState,
    (data) => validateCustomForm(data, ViewCliTimeSheetField)
  );

  const getCliTimeSheetData = async () => {
    try {
      const response = await viewCliTimeSheet()
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
      console.log("Error occurs while getting client data : ", err)
    }
  }

  const fetchViewTimeSheetData = async (client_id, service_id, emp_id, priority, status) => {
    try {
      const payload = {
        "client_id": client_id,
        "service_id": service_id,
        "emp_id": emp_id,
        "priority": priority,
        "status": status
      }
      const response = await getViewTasks(payload)
      const addSno = response?.data?.data.map((data, index) => ({
        sno: index + 1,
        ...data,
        due_date: String(data.due_date)?.split('T')[0] || '',
        assigned_date: String(data?.assigned_date).split('T')[0] || '',
        assignTo: data.assignTo.map((empdata) => ({ value: empdata.emp_id, label: empdata.emp_name }))
      }))
      // setTableData(addSno)
      // setFilteredData(addSno)
      console.log("All Task records : ", response)
    }
    catch (error) {
      console.log("Error occurs while getting all task : ", error.stack)
    }
  }

  useEffect(() => {
    fetchViewTimeSheetData("All", "All", "All", "All", "ALL")
  }, [])

  useEffect(() => {
    // Fetch field option data
    const fetchFieldOptionData = async () => {
      try {
        const clientresponse = await getClient();
        console.log("Client API Response:", clientresponse);

        const updatedFormFields = ViewCliTimeSheetField.map((field) => {
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
    getCliTimeSheetData()
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
      const { start_date, end_date, client } = formData;
      const payload = {
        "client_id": client,
        "start_date": start_date,
        "end_date": end_date,
      }
      const response = await getCliTimeSheet(payload);
      if (!response.data.status) {
        return Swal.fire("Error", response.data.message || "Failed to get client timesheet.", "error");
      }
      const addSno = response.data.data.map((data, index) => ({
        ...data,
        sno: index + 1,
        date: data?.date?.split('T')[0] || data?.date || ""
      }))
      setTableData(addSno || [])
      setFilteredData(addSno || [])
    } catch (err) {
      console.error("Error while get client timesheet data:", err.stack);
      Swal.fire("Error", err.response?.data?.message || "Failed to get client timesheet data.", "error");
    }

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
            />
          </Suspense>
        </Card.Body>
      </Card>
    </Fragment>
  );
};

export default ClientTimeSheet;
