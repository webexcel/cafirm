
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
    { key: "CLIENT_TYPE", label: "Client Type" },
    { key: "CONTACT_PERSON", label: "Contact Person" },
    { key: "EMAIL", label: "Email" },
    { key: "CONTACT", label: "Contact" },
    { key: "ADDRESS", label: "Address" },
    { key: "CITY", label: "City" },
    { key: "COUNTRY", label: "Country" },
    { key: "PINCODE", label: "Pincode" },
    { key: "photo", label: "photo" },
  ];
  const data = {
    NAME: "Balaji",
    CLIENT_TYPE: "Admin",
    CONTACT_PERSON:'Nil',
    EMAIL: "balaji@gmail.com",
    CONTACT : "1234567890",
    ADDRESS : "Nil",
    CITY : "Nil",
    COUNTRY : "Nil",
    PINCODE : "Nil",
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
