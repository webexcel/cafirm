
import React, { Fragment, useState, useEffect, Suspense } from "react";
import { Row, Col, Card } from "react-bootstrap";
import SelectableSearch from "../../components/custom/search/SelectableSearch";
import UserCard from "../../components/custom/card/UserCard";
import Swal from "sweetalert2";
import { editEmployeeDetails } from "../../service/employee_management/viewEditEmployeeService";
import { getClient } from "../../service/client_management/createClientServices";
import { editClientDetails, getClientDetails } from "../../service/client_management/viewEditClientServices";


const ViewEditProfileEmp = () => {
  const [clientsData, setClientsData] = useState([]);
  const [clientData, setClientData] = useState({
    "client_id": "",
    "client_name": "",
    "client_type": "",
    "contact_person": "",
    "email": "",
    "phone": "9876543219",
    "address": "",
    "city": "",
    "state": "",
    "country": "",
    "pincode": "",
    "gst_number": "",
    "pan_number": "",
    "tan_number": "",
    "incorporation_date": "",
    "financial_year_start": "",
    "financial_year_end": "",
  })

  const getClientData = async () => {
    try {
      const response = await getClient()
      const addSno = response.data.data.map((data, index) => ({
        sno: index + 1,
        ...data
      }))
      setClientsData(addSno)
      console.log("client response : ", response)
    }
    catch (err) {
      console.log("Error occurs while getting client data : ", err)
    }
  }

  useEffect(() => {
    getClientData()
  }, [])

  const fields = [
    { key: "client_name", label: "Name" },
    { key: "client_type", label: "Client Type" },
    { key: "client_id", label: "Client ID" },
    { key: "contact_person", label: "Contact Person" },
    { key: "email", label: "Email" },
    { key: "password", label: "Password" },
    { key: "phone", label: "Contact" },
    { key: "photo", label: "photo" },
    { key: "gst_number", label: "GSTIN" },
    { key: "pan_number", label: "Pan Number" },
    { key: "tan_number", label: "Tan Number" },

  ];
  const field1 = [
    { key: "address", label: "Address" },
    { key: "state", label: "State" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
    { key: "country", label: "Country" },
    { key: "pincode", label: "Pincode" },
    { key: "incorporation_date", label: "InCop Date" },
    { key: "financial_year_start", label: "Fin Start Date" },
    { key: "financial_year_end", label: "Fin End Date" },
  ]
  const getCliData = async (item) => {
    console.log("Item : ", item)
    try {
      const payload = {
        "id": item?.client_id || ""
      }
      const response = await getClientDetails(payload)
      const userData = response.data.data[0]
      console.log("User data : ", userData)
      setClientData(prev => ({
        ...prev,
        "client_id": userData?.client_id || "",
        "client_name": userData?.client_name || "",
        "client_type": userData?.client_type || "",
        "contact_person": userData?.contact_person || "",
        "email": userData?.email || "",
        "phone": userData?.phone || "",
        "address": userData?.address || "",
        "city": userData?.city || "",
        "state": userData?.state || "",
        "country": userData?.country || "",
        "pincode": userData?.pincode || "",
        "gst_number": userData?.gst_number || "",
        "pan_number": userData?.pan_number || "",
        "tan_number": userData?.tan_number || "",
        "incorporation_date": userData?.incorporation_date.split('T')[0] || "",
        "financial_year_start": userData?.financial_year_start.split('T')[0] || "",
        "financial_year_end": userData?.financial_year_end.split('T')[0] || "",
      }))
      console.log("Response : ", response)
    }
    catch (err) {
      console.log("Error occurs while getting employee data : ", err.stack)
      Swal.fire("Error", err.response?.data?.message || "Failed to get employee data.", "error");

    }
  }
  const handleFieldUpdate = async (key, value, userData, type) => {
    console.log("Checkk : ", key, value, userData)
    try {
      const payload = {
        "id": userData?.client_id,
        "key": key,
        "value": value
      }
      const response = await editClientDetails(payload)
      if (!response.data.status) {
        Swal.fire("Error", response?.data?.message || "Failed to edit employee data.", "error");
      }
      setClientData(prev => ({
        ...prev,
        [key]: value,
      }))

    }
    catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to edit employee data.", "error");
      console.log("Error occurs while update employee data : ", err.stack)
    }
  }

  return (
    <Fragment>
      <Row>
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Body>
              <Row>
                <Col md={4}>
                  <SelectableSearch
                    listkey="client_name"
                    keybadge=""
                    data={clientsData}
                    onSearch={(results) => console.log("Filtered:", results)}
                    getUserData={(item) => getCliData(item)} />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>


      <Row>
        <Col md={6} >
          <Card className="custom-card">
            <Card.Body>
              <UserCard userData={clientData} fields={fields}
                onFieldUpdate={(key, value, userData) => handleFieldUpdate(key, value, userData, "student")}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} >
          <Card className="custom-card">
            <Card.Header>
              <Card.Title>
                Other Details
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <UserCard userData={clientData} fields={field1}
                onFieldUpdate={(key, value, userData) => handleFieldUpdate(key, value, userData, "")}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default ViewEditProfileEmp;
