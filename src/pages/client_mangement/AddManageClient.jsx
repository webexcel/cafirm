
import React, { Fragment, useCallback, useState, useEffect, Suspense } from "react";
import { Row, Col, Card, Button, Form } from "react-bootstrap";
import Swal from "sweetalert2";
import CustomForm from "../../components/custom/form/CustomForm";
import Loader from "../../components/common/loader/loader";
import useForm from "../../hooks/useForm";
import validateCustomForm from "../../components/custom/form/ValidateForm";
import { AddClientsField } from "../../constants/fields/clinetsFields";
import { addClient, deleteClient, getClient } from "../../service/client_management/createClientServices";
const CustomTable = React.lazy(() =>
  import("../../components/custom/table/CustomTable")
);


const AddManageClient = () => {
  const [tableData, setTableData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(15);
  const [filteredData, setFilteredData] = useState(tableData);
  const [formFields, setFormFields] = useState(AddClientsField);
  const date = new Date()

  const columns = [
    { header: "S.No", accessor: "sno", editable: false },
    { header: "Name", accessor: "display_name", editable: false },
    { header: "Client Type", accessor: "client_type", editable: true },
    { header: "Contact Person", accessor: "contact_person", editable: true },
    { header: "Email", accessor: "email", editable: true },
    { header: "Phone No", accessor: "phone", editable: true },
    { header: "Actions", accessor: "Actions", editable: false },
  ];


  // Initialize form state from field definitions
  const initialFormState = AddClientsField.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {});

  const { formData, errors, handleInputChange, validateForm, resetForm } = useForm(
    initialFormState,
    (data) => validateCustomForm(data, AddClientsField)
  );

  const getClientData = async () => {
    try {
      const response = await getClient()
      const addSno = response.data.data.map((data, index) => ({
        sno: index + 1,
        ...data
      }))
      setTableData(addSno)
      setFilteredData(addSno)
      console.log("response : ", response)
    }
    catch (err) {
      console.log("Error occurs while getting client data : ", err)
    }
  }

  useEffect(() => {
    getClientData()
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
      title: "Are you sure about add client ?",
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
          "name": formData?.name || '',
          "dis_name": formData?.displayname,
          "type": formData?.clientType || '',
          "cont_person": formData?.contactPerson || '',
          "mail": formData?.email || '',
          "phone": formData?.phone || '',
          "address": formData?.address || '',
          "city": formData?.city || '',
          "state": formData?.state || '',
          "country": formData?.country || '',
          "pin": formData?.pincode || '',
          "gst_num": formData?.gst_number || '',
          "pan_num": formData?.pan_number || '',
          "tan_num": formData?.tan_num || '',
          "incop_date": `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}` || "",
          "fin_start": `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}` || "",
          "fin_end": `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}` || ""
        }
        const response = await addClient(payload);
        if (!response.data.status) {
          return Swal.fire("Error", response.data.message || "Failed to add client.", "error");
        }
        console.log("admission numberrr", response)
        Swal.fire("Success", `Client added successfully with Client`, "success");
        resetForm()
        getClientData()
      } catch (err) {
        console.error("Error while get client data:", err.stack);
        Swal.fire("Error", err.response?.data?.message || "Failed to add client data.", "error");
      }
    }

  };

  const onDelete = useCallback(async (updatedData, index) => {
    console.log("update dataaa", updatedData)
    const result = await Swal.fire({
      title: "Are you sure about delete client?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      try {
        console.log("update dataa", updatedData.client_id)
        const payload = { id: updatedData?.client_id || '' };
        const response = await deleteClient(payload);

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

          Swal.fire("Deleted!", response?.data?.message || "Client deleted successfully.", "success");
        }
      } catch (error) {
        Swal.fire("Error", error.response?.data?.message || "Failed to delete client.", "error");
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
            // onEdit={onEdit}
            />
          </Suspense>
        </Card.Body>
      </Card>
    </Fragment>
  );
};

export default AddManageClient;
