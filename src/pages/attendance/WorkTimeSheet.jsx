
import React, { Fragment, useCallback, useState, useEffect, Suspense } from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import Swal from "sweetalert2";
import CustomForm from "../../components/custom/form/CustomForm";
import Loader from "../../components/common/loader/loader";
import useForm from "../../hooks/useForm";
import validateCustomForm from "../../components/custom/form/ValidateForm";
const CustomTable = React.lazy(() =>
    import("../../components/custom/table/CustomTable")
);
import { WorkTimesheetFields } from "../../constants/fields/attendanceFields";
import { getAttendanceByDate } from "../../service/attendance/activityTracker";
import { getEmployeesByPermission } from "../../service/employee_management/viewEditEmployeeService";
import Cookies from 'js-cookie';
import { usePermission } from "../../contexts";
import Search from "../../components/common/search/Search";


const WorkTimeSheet = () => {

    const [tableData, setTableData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(15);
    const [filteredData, setFilteredData] = useState(tableData);
    const [formFields, setFormFields] = useState(WorkTimesheetFields);
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
    const initialFormState = WorkTimesheetFields.reduce((acc, field) => {
        acc[field.name] = "";
        return acc;
    }, {});

    const { formData, errors, handleInputChange, validateForm, resetForm, setFieldValue } = useForm(
        initialFormState,
        (data) => validateCustomForm(data, WorkTimesheetFields)
    );

    useEffect(() => {
        const fetchFieldOptionData = async () => {
            try {
                const userData = JSON.parse(Cookies.get('user'));
                const payload = {
                    emp_id: userData?.employee_id
                };
                const employeeresponse = await getEmployeesByPermission(payload);
                console.log("Employee API Response:", employeeresponse);
                const updatedFormFields = WorkTimesheetFields.map((field) => {
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
                                ...field, options: employeeOptions,
                                disabled: employeeresponse.data.data.length === 1 ? true : false
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
            const userData = JSON.parse(Cookies.get('user'));
            const payload = {
                "emp_id": userData?.employee_id,
                "start_date": "",
                "end_date": "",
                "user_id": userData?.employee_id,
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
            const { employee, dates } = formData;
            const splitDate = String(dates).split('/')
            const userData = JSON.parse(Cookies.get('user'));
            const payload = {
                "emp_id": employee,
                "user_id": userData?.employee_id,
                "start_date": splitDate[0],
                "end_date": splitDate[1]
            }
            console.log("splitDate", splitDate)
            const response = await getAttendanceByDate(payload);
            if (!response.data.status) {
                return Swal.fire("Error", response.data.message || "Failed to get worksheet.", "error");
            }
            const addSno = response.data.data.map((data, index) => ({
                ...data,
                sno: index + 1,
                date: data?.date?.split('T')[0] || data?.date || ""
            }))
            setTableData(addSno || [])
            setFilteredData(addSno || [])
        } catch (err) {
            // setTableData([])
            // setFilteredData([])
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
                                    btnText={'Submit'}
                                    showAddButton={permissionFlags?.showCREATE}
                                    showUpdateButton={permissionFlags?.showUPDATE}

                                />

                            </Col>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className="custom-card p-3">
                <Card.Body className="overflow-auto">
                    <Card.Title className="d-flex">
                        <div className="d-flex justify-content-between
                                                                                border-bottom border-block-end-dashed w-100 pb-3"
                        >
                            <div className="w-25 px-1">
                                <Search label={''} list={tableData} onSearch={(result) => setFilteredData(result)} />
                            </div>
                            <div className="d-flex gap-4 align-items-end">
                                <Button
                                    onClick={async () => {
                                        const { exportToExcel } = await import('../../utils/generalUtils')
                                        exportToExcel(filteredData, 'Attendance Data')
                                    }}
                                    type="button"
                                    variant="primary"
                                    className="btn btn-wave btn-sm me-3 p-2">
                                    Export Excel
                                </Button>
                            </div>
                        </div>

                    </Card.Title>
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
            </Card>
        </Fragment>
    );
};

export default WorkTimeSheet;
