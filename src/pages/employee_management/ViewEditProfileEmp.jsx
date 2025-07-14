import React, { Fragment, useState, useEffect } from "react";
import { Row, Col, Card } from "react-bootstrap";
import SelectableSearch from "../../components/custom/search/SelectableSearch";
import UserCard from "../../components/custom/card/UserCard";
import Swal from "sweetalert2";
import { editEmployeeDetails, getEmployeeDetails, getEmployeesByPermission } from "../../service/employee_management/viewEditEmployeeService";
import { useParams } from "react-router-dom";
import Cookies from 'js-cookie';
import { getPermissionsList } from "../../service/configuration/permissions";
import { getEmployee } from "../../service/employee_management/createEmployeeService";

const ViewEditProfileEmp = () => {
  const { id } = useParams();

  // List of all employees (for search)
  const [employeesData, setEmployeesData] = useState([]);

  // Selected employee for search component
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Single employee data for profile form
  const [employeeData, setEmployeeData] = useState({
    employee_id: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "",
    photo: "",
  });

  // Form fields including role options
  const [fields, setFields] = useState([
    { key: "name", label: "Name", type: "text" },
    { key: "role", label: "Employee Role", type: "list", options: [] },
    { key: "employee_id", label: "Employee ID", type: "Number" },
    { key: "email", label: "Email", type: "email" },
    { key: "phone", label: "Contact", type: "number" },
    { key: "photo", label: "Photo", type: "text" },
  ]);

  // ---------------------------
  // 1️⃣ Load list of employees + role options
  // ---------------------------
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const userData = JSON.parse(Cookies.get('user') || "{}");
        const payload = { emp_id: userData?.employee_id || '' };

        const [employeeListRes, permissionListRes] = await Promise.all([
          getEmployeesByPermission(payload),
          getPermissionsList()
        ]);

        // Add serial number
        const employeeList = employeeListRes.data.data.map((emp, index) => ({
          sno: index + 1,
          ...emp
        }));
        setEmployeesData(employeeList);

        // Add role options
        const roleOptions = permissionListRes.data.data.map((item) => ({
          value: item.permission_id,
          label: item.permission_name,
        }));
        setFields((prevFields) =>
          prevFields.map((field) =>
            field.key === "role" ? { ...field, options: roleOptions } : field
          )
        );

      } catch (error) {
        console.error("Error in fetchInitialData:", error);
        Swal.fire("Error", "Failed to load initial data.", "error");
      }
    };

    fetchInitialData();
  }, []);

  // ---------------------------
  // 2️⃣ Load selected employee by route param
  // ---------------------------
  useEffect(() => {
    if (id) {
      const fetchEmployeeById = async () => {
        try {
          const response = await getEmployee();
          const foundEmployee = response.data.data.find(
            (emp) => String(emp.employee_id) === String(id)
          );

          if (foundEmployee) {
            setSelectedEmployee(foundEmployee);   // Sets it as selected in search
            getEmpData(foundEmployee);            // Loads full details
          } else {
            Swal.fire("Not Found", "Employee not found.", "warning");
          }
        } catch (error) {
          console.error("Error fetching employee by ID:", error);
          Swal.fire("Error", "Failed to load employee details.", "error");
        }
      };

      fetchEmployeeById();
    }
  }, [id]);

  // ---------------------------
  // 3️⃣ Load employee detail for editing
  // ---------------------------
  const getEmpData = async (item) => {
    if (!item?.employee_id) return;

    try {
      const payload = { id: item.employee_id };
      const response = await getEmployeeDetails(payload);
      const userData = response.data.data[0];

      if (!userData) {
        Swal.fire("Error", "Employee details not found.", "error");
        return;
      }

      setEmployeeData({
        employee_id: userData.employee_id || "",
        name: userData.name || "",
        email: userData.email || "",
        password: userData.password_hash || "",
        phone: userData.phone || "",
        role: userData.role || "",
        photo: userData.photo || "",
      });

      setSelectedEmployee(item);  // Keep selected in search

    } catch (error) {
      console.error("Error getting employee data:", error);
      Swal.fire("Error", error?.response?.data?.message || "Failed to get employee data.", "error");
    }
  };

  // ---------------------------
  // 4️⃣ Handle profile field update
  // ---------------------------
  const handleFieldUpdate = async (key, value, userData) => {
    try {
      const payload = {
        id: userData?.employee_id,
        key,
        value
      };

      const response = await editEmployeeDetails(payload);

      if (!response.data.status) {
        Swal.fire("Error", response?.data?.message || "Failed to edit employee data.", "error");
        return;
      }

      Swal.fire("Updated!", "Employee data updated successfully.", "success");

      setEmployeeData((prev) => ({
        ...prev,
        [key]: value,
      }));

      // If photo updates, also update cookie
      if (key === "photo") {
        const userCookie = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : null;
        if (userCookie && userData?.employee_id === userCookie.employee_id) {
          Cookies.set('user', JSON.stringify({ ...userCookie, photo: value }));
        }
      }

    } catch (error) {
      console.error("Error updating employee data:", error);
      Swal.fire("Error", error?.response?.data?.message || "Failed to edit employee data.", "error");
    }
  };

  // ---------------------------
  // Render
  // ---------------------------
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
                    value={selectedEmployee}
                    onSearch={(results) => console.log("Filtered:", results)}
                    getUserData={getEmpData}
                  />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="custom-card">
            <Card.Body>
              <UserCard
                userData={employeeData}
                fields={fields}
                onFieldUpdate={handleFieldUpdate}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default ViewEditProfileEmp;
