
import React, { Fragment, useState, useEffect, Suspense } from "react";
import { Row, Col, Card } from "react-bootstrap";
import SelectableSearch from "../../components/custom/search/SelectableSearch";
import UserCard from "../../components/custom/card/UserCard";
import Swal from "sweetalert2";
import { editEmployeeDetails, getEmployeeDetails, getEmployeesByPermission } from "../../service/employee_management/viewEditEmployeeService";
import { useSearchParams } from "react-router-dom";
import Cookies from 'js-cookie';
import { getPermissionsList } from "../../service/configuration/permissions";

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
  const [fields, setFields] = useState([
    { key: "name", label: "Name", type: "text" },
    {
      key: "role", label: "Employee Role", type: "list",
      options: [],
    },
    { key: "employee_id", label: "Employee ID", type: "Number" },
    { key: "email", label: "Email", type: "email" },
    { key: "phone", label: "Contact", type: "number" },
    { key: "photo", label: "photo", type: "text" },
  ])
  const [searchParams] = useSearchParams();
  const empid = searchParams.get("id");

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
        role: userData?.role,
        photo: userData?.photo
      }))
      console.log("Response : ", response)
    }
    catch (err) {
      console.log("Error occurs while getting employee data : ", err.stack)
      Swal.fire("Error", err.response?.data?.message || "Failed to get employee data.", "error");

    }
  }

  useEffect(() => {
    console.log("params check : ", empid)
    if (empid) {
      const payload = { employee_id: empid };
      getEmpData(payload);
    }
  }, [empid]);

  useEffect(() => {
    const fetchInitiallyData = async () => {
      const userData = JSON.parse(Cookies.get('user'));
      const payload = { "emp_id": userData?.employee_id || '' };

      try {
        const [employeeDataRes, permissionDataRes] = await Promise.all([
          getEmployeesByPermission(payload),
          getPermissionsList()
        ]);
        console.log("employeeData", employeeDataRes, "permissionData", permissionDataRes, "field", fields)
        const addSno = await employeeDataRes.data.data.map((data, index) => ({
          sno: index + 1,
          ...data
        }))
        setEmployeesData(addSno)
        const updatedFormFields = fields.map((field) => {
          if (field.key === "role") {
            console.log("field.name", field.key)
            if (Array.isArray(permissionDataRes.data.data) && permissionDataRes.data.data.length > 0) {
              const employeeRoleOptions = permissionDataRes.data.data.map((item) => ({
                value: item.permission_id,
                label: item.permission_name,
              }));
              console.log("Mapped Employee Role Options:", employeeRoleOptions);
              return { ...field, options: employeeRoleOptions };
            } else {
              console.error("Employee role data response is not an array or is empty.");
            }
          }
          return field;
        });
        setFields(updatedFormFields);
        console.log("fieldsfieldsfields", fields)
      } catch (error) {
        console.error("Unexpected error in fetchInitiallyData:", error);
      }
    };

    fetchInitiallyData();
  }, []);

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
        Swal.fire("Error", response?.data?.message || "Failed to edit employee data.", "error");
      }
      Swal.fire("Updated!", "Employee data updated successfully.", "success");
      setEmployeeData(prev => ({
        ...prev,
        [key]: value,
      }))
      if (key === "photo") {
        const userDataCookies = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
        if (userDataCookies && userData?.employee_id === userDataCookies.employee_id) {
          console.log("Profile changing test:", userData);
          const data = {
            ...userDataCookies,
            photo: userData.photo
          };

          Cookies.set('user', JSON.stringify(data));
        }

        console.log("userData:", userData, "userDataCookies:", userDataCookies);
      }

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
