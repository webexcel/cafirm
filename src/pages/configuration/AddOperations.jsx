
import React, {
    Fragment,
    useCallback,
    useState,
    useEffect,
    Suspense,
} from "react";
import { Row, Col, Card } from "react-bootstrap";
import Swal from "sweetalert2";
import CustomForm from "../../components/custom/form/CustomForm";
import Loader from "../../components/common/loader/loader";
import useForm from "../../hooks/useForm";
import validateCustomForm from "../../components/custom/form/ValidateForm";

import {
    deleteEmployee,
} from "../../service/employee_management/createEmployeeService";
import { usePermission } from "../../contexts";
import { AddOperationsFields } from "../../constants/fields/configurationFields";
import { addMenuOperations, getMenuList, getOperationList, getOperationMappedList } from "../../service/configuration/permissionMenu";

const CustomTable = React.lazy(() =>
    import("../../components/custom/table/CustomTable")
);

const AddOperations = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(15);
    const [filteredData, setFilteredData] = useState([]);
    const [formFields, setFormFields] = useState(AddOperationsFields);
    const { getOperationFlagsById } = usePermission();
    const [permissionFlags, setPermissionFlags] = useState(1);
    const [menuList, setMenuList] = useState([])
    const [operationList, setOperationList] = useState([])

    const columns = [
        { header: "Sno", accessor: "sno", editable: false },
        { header: "Menu", accessor: "menu_name", editable: false },
        { header: "Operation", accessor: "operations", editable: true },
        { header: "Actions", accessor: "Actions", editable: false },
    ];

    const initialFormState = AddOperationsFields.reduce((acc, field) => {
        acc[field.name] = "";
        return acc;
    }, {});

    const { formData, errors, handleInputChange, validateForm, resetForm, setFieldValue } =
        useForm(initialFormState, (data) =>
            validateCustomForm(data, AddOperationsFields)
        );

    useEffect(() => {
        const getInitallData = async () => {
            try {
                const response = await getMenuList();
                const operationResponse = await getOperationMappedList()
                const addSno = response.data.data.map((data, index) => ({
                    ...data,
                    sno: index + 1
                }))
                const updatedFormFields = formFields.map((field) => {
                    if (field.name === "menu") {
                        if (Array.isArray(response.data.data) && response.data.data.length > 0) {
                            const menuOptions = response.data.data.map((item) => ({
                                value: item.menu_id,
                                label: item.menu_name,
                            }));
                            console.log("Mapped Employee Role Options:", menuOptions);
                            return { ...field, options: menuOptions };
                        } else {
                            console.error("Employee role data response is not an array or is empty.");
                        }

                    }
                    return field;
                });
                setFormFields(updatedFormFields);
                const addSnoOperation = operationResponse.data.data.map((data, index) => ({
                    ...data,
                    sno: index + 1,
                    operations: data.operations.map((data, index) => ({ value: index, label: data }))
                }))
                setMenuList(addSno || [])
                setOperationList(addSnoOperation || [])
            }
            catch (error) {
                console.log("Error getting operation list : ", error.stack)
            }
        }
        getInitallData()
    }, [])

    useEffect(() => {
        if (formData.menu) {
            const operationOptionData = async () => {
                try {
                    const payload = {
                        "menu_id": formData.menu
                    };
                    const response = await getOperationList(payload);

                    const updatedFormFields = formFields.map((field) => {
                        if (field.name === "operations") {
                            if (Array.isArray(response.data.data) && response.data.data.length > 0) {
                                const operationOptions = response.data.data.map((item) => ({
                                    value: item.operation_id,
                                    label: item.operation_name,
                                }));
                                return { ...field, options: operationOptions };
                            } else {
                                console.error("Operation data response is not an array or is empty.");
                                return { ...field, options: [] };
                            }
                        }
                        return field;
                    });
                    setFormFields(updatedFormFields);
                    console.log("Mapped Operation Options:", formFields);

                } catch (error) {
                    console.error("Error fetching Operation data:", error);
                }
            };

            operationOptionData();
        }
    }, [formData.menu]);

    console.log("permssss", permissionFlags)

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const result = await Swal.fire({
            title: "Are you sure you want to add operation?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, add it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            try {

                console.log("Form data : ", formData)
                const opt_ids = formData?.operations.map(data => data.value)
                const payload = {
                    "menu_id": formData?.menu,
                    "operation_ids": opt_ids
                };
                const response = await addMenuOperations(payload);
                if (!response.data.status) {
                    return Swal.fire(
                        "Error",
                        response.data.message || "Failed to create Operations.",
                        "error"
                    );
                }

                Swal.fire("Success", "Operations Created successfully.", "success");
                resetForm();
            } catch (err) {
                Swal.fire(
                    "Error",
                    err.response?.data?.message || "Failed to create Operations.",
                    "error"
                );
            }
        }
    };

    const onDelete = useCallback(async (updatedData, index) => {
        const result = await Swal.fire({
            title: "Are you sure you want to delete this employee?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            try {
                const payload = { id: updatedData?.employee_id || "" };
                const response = await deleteEmployee(payload);

                if (response.data.status) {
                    setFilteredData((prevData) => {
                        const newFilteredData = prevData
                            .filter((item, ind) => ind !== index)
                            .map((item, ind) => ({ ...item, sno: ind + 1 }));
                        setTableData(newFilteredData);
                        return newFilteredData;
                    });

                    Swal.fire("Deleted!", "Employee deleted successfully.", "success");
                }
            } catch (error) {
                Swal.fire(
                    "Error",
                    error.response?.data?.message || "Failed to delete employee.",
                    "error"
                );
            }
        }
    }, []);

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
                                    showAddButton={true}
                                    showUpdateButton={permissionFlags?.showUPDATE}
                                />
                            </Col>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Card className="custom-card p-3">
                <Card.Body className="overflow-auto">
                    <Suspense fallback={<Loader />}>
                        <CustomTable
                            columns={columns}
                            data={operationList}
                            currentPage={currentPage}
                            recordsPerPage={recordsPerPage}
                            totalRecords={filteredData.length}
                            handlePageChange={handlePageChange}
                            onDelete={onDelete}
                            showDeleteButton={permissionFlags?.showDELETE}
                            showUpdateButton={permissionFlags?.showUPDATE}
                        />
                    </Suspense>
                </Card.Body>
            </Card>
        </Fragment>
    );
};

export default AddOperations;
