import React, { Fragment, useCallback, useState, useEffect, Suspense } from "react";
import { Row, Col, Card } from "react-bootstrap";
import Swal from "sweetalert2";
import CustomForm from "../../components/custom/form/CustomForm";
import Loader from "../../components/common/loader/loader";
import useForm from "../../hooks/useForm";
import validateCustomForm from "../../components/custom/form/ValidateForm";
const CustomTable = React.lazy(() =>
    import("../../components/custom/table/CustomTable")
);
import { getAttendanceByDate } from "../../service/attendance/activityTracker";
import { getEmployeesByPermission } from "../../service/employee_management/viewEditEmployeeService";
import Cookies from 'js-cookie';
import { usePermission } from "../../contexts";
import { AssignUserFields } from "../../constants/fields/configurationFields";
import { getEmployee } from "../../service/employee_management/createEmployeeService";
import { assignPermission, getPermissionsList } from "../../service/configuration/permissions";


const AssignUser = () => {

    const [tableData, setTableData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(15);
    const [filteredData, setFilteredData] = useState(tableData);
    const [formFields, setFormFields] = useState(AssignUserFields);
    const { permissions, getOperationFlagsById } = usePermission();
    const [permissionFlags, setPermissionFlags] = useState(1);

    const columns = [
        { header: "Sno", accessor: "sno", editable: false },
        { header: "Emp Name", accessor: "employee_name", editable: false },
        { header: "Start Date", accessor: "login_date", editable: false },
        { header: "End Date", accessor: "logout_date", editable: false },
        { header: "Start Time", accessor: "login_time", editable: false },
        { header: "End Time", accessor: "logout_time", editable: false },
        { header: "Total Time", accessor: "total_time", editable: true },
    ];

    // Initialize form state from field definitions
    const initialFormState = AssignUserFields.reduce((acc, field) => {
        acc[field.name] = "";
        return acc;
    }, {});

    const { formData, errors, handleInputChange, validateForm, resetForm, setFieldValue } = useForm(
        initialFormState,
        (data) => validateCustomForm(data, AssignUserFields)
    );

    useEffect(() => {
        const fetchFieldOptionData = async () => {
            try {
                const employeeresponse = await getEmployee();
                const permissionList = await getPermissionsList();
                console.log("Employee API Response:", employeeresponse);
                const updatedFormFields = AssignUserFields.map((field) => {
                    if (field.name === "employee") {
                        if (Array.isArray(employeeresponse.data.data) && employeeresponse.data.data.length > 0) {
                            if (employeeresponse.data.data.length === 1) {
                                setFieldValue("employee", employeeresponse.data.data[0].employee_id);
                                console.log("userData111111111111111", employeeresponse.data.data);
                            }
                            const employeeOptions = employeeresponse.data.data.map((item) => ({
                                value: item.employee_id,
                                label: item.name,
                            }));
                            console.log("Mapped Employee Options:", employeeOptions);
                            return {
                                ...field, options: employeeOptions,
                                disabled: employeeresponse.data.data.length === 1 ? true : false
                            };
                        } else {
                            console.error("Employee data response is not an array or is empty.");
                        }

                    }
                    if (field.name === "permissions") {
                        if (Array.isArray(permissionList.data.data) && permissionList.data.data.length > 0) {
                            if (permissionList.data.data.length === 1) {
                                setFieldValue("employee", permissionList.data.data[0].employee_id);
                                console.log("userData111111111111111", permissionList.data.data);
                            }
                            const permissionsOptions = permissionList.data.data.map((item) => ({
                                value: item.permission_id,
                                label: item.permission_name,
                            }));
                            console.log("Mapped Employee Options:", permissionsOptions);
                            return {
                                ...field, options: permissionsOptions,
                                // disabled: permissionList.data.data.length === 1 ? true : false
                            };
                        } else {
                            console.error("Employee data response is not an array or is empty.");
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
        const permissionFlags = getOperationFlagsById(19, 2); // paren_id , sub_menu id
        console.log(permissionFlags, '---permissionFlags');
        setPermissionFlags(permissionFlags);

    }, [])

    const getWorkTimeSheetData = async () => {
        try {
            const payload = {
                "emp_id": "",
                "start_date": "",
                "end_date": ""
            }
            const response = await getAttendanceByDate(payload)
            const addSno = response.data.data.map((data, index) => ({
                ...data,
                sno: index + 1,
            }))
            setTableData(addSno || [])
            setFilteredData(addSno || [])
            console.log("response : ", response)
        }
        catch (error) {
            console.log("error", error)
        }
    }

    useEffect(() => {
        getWorkTimeSheetData()
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
            const payload = {
                permission_id: formData?.employee || '',
                employee_id: formData?.permissions || ''
            }
            const response = await assignPermission(payload);
            if (!response.data.status) {
                return Swal.fire("Error", response.data.message || "Failed to assign user.", "error");
            }
             Swal.fire({
                      icon: "success",
                      title: "Assign User Successfully!",
                      confirmButtonText: "OK",
                    });
            resetForm()
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
                                    btnText={'Assign'}
                                    showAddButton={permissionFlags?.showCREATE}
                                    showUpdateButton={permissionFlags?.showUPDATE}

                                />

                            </Col>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* <Card className="custom-card p-3">
                <Card.Body className="overflow-auto">
                    <Suspense fallback={<Loader />}>
                        <CustomTable
                            columns={columns}
                            data={filteredData}
                            currentPage={currentPage}
                            recordsPerPage={recordsPerPage}
                            totalRecords={filteredData.length}
                            handlePageChange={handlePageChange}
                            showDeleteButton={permissionFlags?.showDELETE}
                            showUpdateButton={permissionFlags?.showUPDATE}

                        />
                    </Suspense>
                </Card.Body>
            </Card> */}
        </Fragment>
    );
};

export default AssignUser;
