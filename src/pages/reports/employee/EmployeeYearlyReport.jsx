import React, { Fragment, useState, useEffect, Suspense } from "react";
import { Row, Col, Card } from "react-bootstrap";
import Swal from "sweetalert2";
import useForm from "../../../hooks/useForm";
import validateCustomForm from "../../../components/custom/form/ValidateForm";
import { getEmployeesByPermission } from "../../../service/employee_management/viewEditEmployeeService";
import Cookies from 'js-cookie';
import { usePermission } from "../../../contexts";
import DashboardCard from "../../dashboard/DashboardCard";
import { Basicline } from "../linechartdata";
import CustomForm from "../../../components/custom/form/CustomForm";
import { EmployeeYearlyFields } from "../../../constants/fields/reports";
import { getEmployeeYearlyReport } from "../../../service/reports/employeeReports";
const EmployeeYearlyReport = () => {
  const [formFields, setFormFields] = useState(EmployeeYearlyFields);
  const { permissions, getOperationFlagsById } = usePermission();
  const [permissionFlags, setPermissionFlags] = useState(1);
  const [chartData, setChartData] = useState({ months: [], monthData: [] });
  const initialFormState = EmployeeYearlyFields.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {});
  const [allCount, setAllCount] = useState([
    {
      label: "Total Task",
      value: 0,
      icon: "bi-card-checklist",
      color: "bg-primary-transparent"
    },
    {
      label: "Pending",
      value: 0,
      icon: "bi-hourglass-split",
      color: "bg-warning-transparent"
    },
    {
      label: "In Progress",
      value: 0,
      icon: "bi-arrow-repeat",
      color: "bg-info-transparent"
    },
    {
      label: "Completed",
      value: 0,
      icon: "bi-check2-circle",
      color: "bg-success-transparent"
    }
  ]);

  const { formData, errors, handleInputChange, validateForm, setFieldValue } = useForm(
    initialFormState,
    (data) => validateCustomForm(data, EmployeeYearlyFields)
  );

  useEffect(() => {
    const fetchFieldOptionData = async () => {
      try {
        const userData = JSON.parse(Cookies.get('user'));
        const payload = { emp_id: userData?.employee_id };
        const employeeresponse = await getEmployeesByPermission(payload);
        const updatedFormFields = EmployeeYearlyFields.map((field) => {
          if (field.name === "employee") {
            if (Array.isArray(employeeresponse.data.data) && employeeresponse.data.data.length > 0) {
              if (employeeresponse.data.data.length === 1) {
                setFieldValue("employee", employeeresponse.data.data[0].employee_id);
              }
              const employeeOptions = employeeresponse.data.data.map((item) => ({
                value: item.employee_id,
                label: item.name,
              }));
              return {
                ...field,
                options: employeeOptions,
                disabled: employeeresponse.data.data.length === 1
              };
            }
          }
          if (field.name === "weekly_id") {
            const getCurrentWeek = () => {
              const today = new Date();
              const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
              const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
              return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
            };
            const currentWeek = getCurrentWeek();
            const weekList = Array.from({ length: currentWeek }, (_, i) => ({
              label: `Week ${i + 1}`,
              value: `${i + 1}`
            }));

            if (Array.isArray(weekList) && weekList.length > 0) {
              return {
                ...field,
                options: weekList,
              };
            }
          }
          return field;
        });
        setFormFields(updatedFormFields);
      } catch (error) {
        console.error("Error fetching class data:", error);
      }
    };
    fetchFieldOptionData();
    const permissionFlags = getOperationFlagsById(19, 2);
    setPermissionFlags(permissionFlags);
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      console.log("form data :", formData)
      const payload = {
        emp_id: formData?.employee,
        year: new Date(formData?.year_id).getFullYear()
      };
      const response = await getEmployeeYearlyReport(payload);

      if (!response.data?.status) {
        return Swal.fire("Error", response.data?.message || "Failed to get year employee data.", "error");
      }
      console.log("API response:", response);

      setAllCount([
        {
          label: 'Total Task',
          value: response?.data?.count?.total_tasks || 0,
          icon: "bi-card-checklist",
          color: "bg-primary-transparent"
        },
        {
          label: 'Pending',
          value: response?.data?.count?.pending || 0,
          icon: "bi-hourglass-split",
          color: "bg-warning-transparent"
        },
        {
          label: 'In Progress',
          value: response?.data?.count?.inprocess || 0,
          icon: "bi-arrow-repeat",
          color: "bg-info-transparent"
        },
        {
          label: 'Completed',
          value: response?.data?.count?.completed || 0,
          icon: "bi-check2-circle",
          color: "bg-success-transparent"
        }
      ]);
      const months = response.data.data.task_count_per_month.map((m) => m.month);
      const monthdata = response.data.data.task_count_per_month.map((m) => m.count);
      setChartData({ months, monthData: monthdata });
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || "Failed to get year employee data.", "error");
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
                  showAddButton={permissionFlags?.showCREATE}
                  showUpdateButton={permissionFlags?.showUPDATE}
                />
              </Col>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {
          // submitState && (
          <Col xl={12}>
            <Row>
              {allCount.map((item, idx) => (
                <Col md={3} key={idx} className="card-background flex-fill">
                  <DashboardCard
                    Title={item.label}
                    Count={item.value}
                    Icon={item.icon}
                    Color={item.color}
                  />
                </Col>
              ))}

            </Row>
          </Col>
          // )
        }

        {
          // submitState && (
          <>
            <Col xl={12}>
              <Card className="custom-card p-3">
                <Card.Body className="overflow-auto">
                  {chartData.monthData.length > 0 ? (
                    <div id="line-chart">
                      <Basicline chartData={chartData} />
                    </div>
                  ) : (
                    <div className="fs-16 fw-semibold d-flex justify-content-center">No Data Found!</div>
                  )}

                </Card.Body>
              </Card>
            </Col>
          </>
          // )
        }

      </Row>
    </Fragment >
  );
};

export default EmployeeYearlyReport;
