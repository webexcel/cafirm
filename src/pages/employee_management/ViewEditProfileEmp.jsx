
import React, { Fragment, useState, useEffect, Suspense } from "react";
import { Row, Col, Card } from "react-bootstrap";
import SelectableSearch from "../../components/custom/search/SelectableSearch";
import UserCard from "../../components/custom/card/UserCard";
import Swal from "sweetalert2";
import { getEmployee } from "../../service/employee_management/createEmployeeService";
import { editEmployeeDetails, getEmployeeDetails } from "../../service/employee_management/viewEditEmployeeService";


const ViewEditProfileEmp = () => {
  const [employeesData, setEmployeesData] = useState([]);
  const [employeeData, setEmployeeData] = useState({
    "employee_id": "",
    "name": "",
    "email": "",
    "password": "",
    "phone": "",
    "role": "",
  })

  const getEmployeeData = async () => {
    try {
      const response = await getEmployee()
      const addSno = response.data.data.map((data, index) => ({
        sno: index + 1,
        ...data
      }))
      setEmployeesData(addSno)
      console.log("response : ", response)
    }
    catch (err) {
      console.log("Error occurs while getting employee data : ", err)
    }
  }

  useEffect(() => {
    getEmployeeData()
  }, [])

  const fields = [
    { key: "name", label: "Name" },
    { key: "role", label: "Employee Role" },
    { key: "employee_id", label: "Employee ID" },
    { key: "email", label: "Email" },
    { key: "password", label: "Password" },
    { key: "phone", label: "Contact" },
    { key: "photo", label: "photo" },
  ];
  const getEmpData = async (item) => {
    console.log("Item : ", item)
    try {
      const payload = {
        "id": item?.employee_id || ""
      }
      const response = await getEmployeeDetails(payload)
      const userData = response.data.data[0]
      console.log("User data : ", userData)
      setEmployeeData(prev => ({
        ...prev,
        email: userData?.email,
        password: userData?.password_hash,
        employee_id: userData?.employee_id,
        name: userData?.name,
        phone: userData?.phone,
        role: userData?.role
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
        "id": userData?.employee_id,
        "key": key,
        "value": value
      }
      const response = await editEmployeeDetails(payload)
      if (!response.data.status) {

      }
      setEmployeeData(prev => ({
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
                    listkey="name"
                    keybadge=""
                    data={employeesData}
                    onSearch={(results) => console.log("Filtered:", results)}
                    getUserData={(item) => getEmpData(item)} />
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
              <UserCard userData={employeeData} fields={fields}
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
