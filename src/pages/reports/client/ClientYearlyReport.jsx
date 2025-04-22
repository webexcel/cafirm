
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
import { ClientYearlyFields } from "../../../constants/fields/reports";
import { getClientYearlyReport, getEmployeeYearlyReport } from "../../../service/reports/employeeReports";
import { getClient } from "../../../service/client_management/createClientServices";
const ClientYearlyReport = () => {
  const [formFields, setFormFields] = useState(ClientYearlyFields);
  const { permissions, getOperationFlagsById } = usePermission();
  const [permissionFlags, setPermissionFlags] = useState(1);
  const [chartData, setChartData] = useState({ months: [], monthData: [] });
  const initialFormState = ClientYearlyFields.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {});
  const [allCount, setAllCount] = useState([
    { label: "Total Task", value: 0 },
    { label: "Pending", value: 0 },
    { label: "In Progress", value: 0 },
    { label: "Completed", value: 0 },
  ])

  const { formData, errors, handleInputChange, validateForm, setFieldValue } = useForm(
    initialFormState,
    (data) => validateCustomForm(data, ClientYearlyFields)
  );

  useEffect(() => {
    const fetchFieldOptionData = async () => {
      try {
        const clientresponse = await getClient();
        const updatedFormFields = ClientYearlyFields.map((field) => {
          if (field.name === "client") {
            if (Array.isArray(clientresponse.data.data) && clientresponse.data.data.length > 0) {
              const clientOptions = clientresponse.data.data.map((item) => ({
                value: item.client_id,
                label: item.client_name,
              }));
              return {
                ...field,
                options: clientOptions,
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
        client_id: formData?.client,
        year: new Date(formData?.year_id).getFullYear()
      };
      const response = await getClientYearlyReport(payload);

      if (!response.data?.status) {
        return Swal.fire("Error", response.data?.message || "Failed to get year employee data.", "error");
      }
      console.log("API response:", response);
      setAllCount([
        { label: 'Total Task', value: response?.data?.count?.total_tasks || 0 },
        { label: 'Pending', value: response?.data?.count?.pending || 0 },
        { label: 'In Progress', value: response?.data?.count?.inprocess || 0 },
        { label: 'Completed', value: response?.data?.count?.completed || 0 }
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
                    Icon={'fe fe-user-plus'}
                    Color={'bg-teal-transparent text-teal'}
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

export default ClientYearlyReport;
