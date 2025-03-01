
import React, { Fragment, useState, useEffect, Suspense } from "react";
import { Row, Col, Card } from "react-bootstrap";
import CustomForm from "../../components/custom/form/CustomForm";
import useForm from "../../hooks/useForm";
import validateCustomForm from "../../components/custom/form/ValidateForm";
import SelectableSearch from "../../components/custom/search/SelectableSearch";
import UserCard from "../../components/custom/card/UserCard";
import Swal from "sweetalert2";


const ViewEditProfileEmp = () => {
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [studentData, setStudentData] = useState({})

  const fields = [
    { key: "NAME", label: "Name" },
    { key: "EMPLOYEE_ROLE", label: "Employee Role" },
    { key: "EMAIL", label: "Email" },
    { key: "PASSWORD", label: "Password" },
    { key: "CONTACT", label: "Contact" },
    { key: "photo", label: "photo" },
  ];
  const data = {
    NAME: "Balaji",
    EMPLOYEE_ROLE: "Admin",
    EMAIL: "balaji@gmail.com",
    PASSWORD: "*******",
    CONTACT : "1234567890",
  }
  const getStudentData = (item) => {

  }
  const handleFieldUpdate = (key, value, userData, type) => {
    setStudentData({ ...userData, [key]: value })
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
                    listkey="NAME"
                    keybadge="CLASSSEC"
                    data={tableData}
                    onSearch={(results) => console.log("Filtered:", results)}
                    getUserData={(item) => getStudentData(item)} />
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
              <UserCard userData={data} fields={fields} onFieldUpdate={(key, value, userData) => handleFieldUpdate(key, value, userData, "student")} />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default ViewEditProfileEmp;
