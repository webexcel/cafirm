import React, { Suspense, useCallback, useEffect, useState } from "react";
import { Form, Button, Row, Col, Card } from "react-bootstrap";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { addMenu, deleteMenu, getMenuList, getParentMenuList, updateMenu } from "../../service/configuration/permissionMenu";
import CustomTable from "../../components/custom/table/CustomTable";
import Swal from "sweetalert2";
import Loader from "../../components/common/loader/loader";
import Cookies from 'js-cookie';

const validationSchema = Yup.object().shape({
    parentType: Yup.string().required("Menu Type is required"),
    menuName: Yup.string().required("Menu Name is required"),
    subMenuName: Yup.string().when("parentType", {
        is: "1",
        then: (schema) => schema.required("Sub Menu Name is required").min(3, "Must be at least 3 characters"),
        otherwise: (schema) => schema.notRequired(),
    }),
});

const AddMenu = () => {

    const [menuList, setMenuList] = useState([])
    const [allMenuList, setallMenuList] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [recordsPerPage] = useState(15);
    const [filteredData, setFilteredData] = useState(menuList);

    const columns = [
        { header: "Menu ID", accessor: "menu_id", editable: false },
        { header: "Menu Name", accessor: "menu_name", editable: true },
        { header: "Actions", accessor: "Actions", editable: false },
    ];

    const fetchMenuList = async () => {
        try {
            const response = await getParentMenuList();
            const addSno = response?.data?.data.map((data, index) => ({
                ...data,
                sno: index + 1
            }))
            setMenuList(addSno)
        }
        catch (error) {
            console.log("Error occurs while getting menu list : ", error.stack)
        }
    }

    useEffect(() => {
        fetchMenuList()
    }, [])

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [menuList] = await Promise.all([getMenuList()]);
                const menu = menuList?.data?.data || [];
                setallMenuList(menu);
            } catch (error) {
                console.error("Error occurs while getting menu list:", error);
            }
        };

        fetchInitialData();
    }, []);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const onDelete = useCallback(async (updatedData, index) => {
        console.log("updatedData updatedData", updatedData)
        const result = await Swal.fire({
            title: "Are you sure you want to delete menu?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            try {
                const payload = { menu_id: updatedData?.menu_id || "" };
                const response = await deleteMenu(payload);

                if (response.data.status) {
                    setFilteredData((prevData) => {
                        const newFilteredData = prevData
                            .filter((item, ind) => ind !== index)
                            .map((item, ind) => ({ ...item, sno: ind + 1 }));
                        // setTableData(newFilteredData);
                        return newFilteredData;
                    });
                    fetchMenuList()
                    Swal.fire("Deleted!", "Menu deleted successfully.", "success");
                }
            } catch (error) {
                Swal.fire(
                    "Error",
                    error.response?.data?.message || "Failed to delete menu.",
                    "error"
                );
            }
        }
    }, []);

    const handleSaveEdit = async (index, updatedData) => {

        console.log("update valuess", updatedData)

        const payload = {
            menu_id: updatedData?.menu_id,
            type: '',
            parent_id: updatedData?.parent_id,
            menu_name: updatedData?.menu_name
        }

        try {
            const response = await updateMenu(payload);
            if (response.data) {
                setFilteredData((prevData) =>
                    prevData.map((row, i) => (i === index ? { ...row, ...updatedData } : row))
                );
                Swal.fire({
                    icon: "success",
                    title: "Menu Edited Successfully!",
                    confirmButtonText: "OK",
                });
            }
        } catch (error) {
            console.log("error in edit menu", error)
            Swal.fire({
                icon: "error",
                title: "Failed to Edit Menu",
                text: error?.response?.data?.message || "Something went wrong while editing the menu.",
                confirmButtonText: "OK",
            });
        }
        setEditingIndex(null);
    };

    return (
        <Row className="justify-content-center">
            <Col md={12}>
                <Card className="pb-3 w-100">
                    <Card.Body>
                        <Formik
                            initialValues={{
                                parentType: "",
                                menuName: "",
                                subMenuName: "",
                            }}
                            validationSchema={validationSchema}
                            onSubmit={async (values, { resetForm }) => {
                                const result = await Swal.fire({
                                    title: "Are you sure about add menu ?",
                                    text: "You won't be able to revert this!",
                                    icon: "warning",
                                    showCancelButton: true,
                                    confirmButtonText: "Yes, Add it!",
                                    cancelButtonText: "No, cancel!",
                                    reverseButtons: true,
                                });
                                if (result.isConfirmed) {
                                    try {
                                        const userData = JSON.parse(Cookies.get('user'));
                                        const payload = {
                                            "type": values?.parentType || 0,
                                            "parent_id": values?.parentType === "1" ? values?.menuName : null,
                                            "menu_name": values?.parentType === "1" ? values?.subMenuName : values.menuName,
                                            "user_id": userData?.employee_id || ''
                                        }
                                        const response = await addMenu(payload);
                                        if (!response.data.status) {
                                            return Swal.fire("Error", response.data.message || "Failed to add Menu.", "error");
                                        }
                                        console.log("admission numberrr", response)
                                        Swal.fire("Success", `Menu added successfully with Menu`, "success");
                                        resetForm()
                                        fetchMenuList()
                                        console.log("Form Data:", values, payload);
                                    }
                                    catch (error) {
                                        console.log("valuess", values)
                                        console.log("Error Occurs while adding menu : ", error.stack)
                                        Swal.fire("Error", error.response?.data?.message || "Failed to add Menu data.", "error");

                                    }

                                }

                            }}
                        >
                            {({ handleSubmit, values }) => (
                                <Form onSubmit={handleSubmit} className="d-flex gap-3">
                                    <div className="d-flex flex-grow-1 gap-3" style={{ width: "80%" }}>
                                        <Form.Group className="flex-grow-1">
                                            <Field as="select" name="parentType" className="form-select">
                                                <option value="">Select type</option>
                                                <option value="0">Parent</option>
                                                <option value="1">Children</option>
                                            </Field>
                                            <ErrorMessage name="parentType" component="div" className="text-danger small mx-1 my-1" />
                                        </Form.Group>

                                        <Form.Group className="flex-grow-1">
                                            {values.parentType === "1" ? (
                                                <Field as="select" name="menuName" className="form-select">
                                                    <option value="">Select Menu</option>
                                                    {menuList.map((menu, index) => (
                                                        <option key={index} value={menu.menu_id}>
                                                            {menu.menu_name}
                                                        </option>
                                                    ))}
                                                </Field>
                                            ) : (
                                                <Field
                                                    type="text"
                                                    name="menuName"
                                                    className="form-control"
                                                    placeholder="Enter menu name"
                                                />
                                            )}
                                            <ErrorMessage name="menuName" component="div" className="text-danger small mx-1 my-1" />
                                        </Form.Group>

                                        {values.parentType === "1" && (
                                            <Form.Group className="flex-grow-1">
                                                <Field
                                                    type="text"
                                                    name="subMenuName"
                                                    className="form-control"
                                                    placeholder="Enter sub menu name"
                                                />
                                                <ErrorMessage name="subMenuName" component="div" className="text-danger small mx-1 my-1" />
                                            </Form.Group>
                                        )}
                                    </div>

                                    <div className="mx-2" style={{ width: "20%" }}>
                                        <Button variant="primary" className="btn btn-sm px-4 py-2" type="submit">
                                            Submit
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </Formik>
                    </Card.Body>
                </Card>
            </Col>

            <Col md={12}>
                <Card className="custom-card p-3">
                    <Card.Body className="overflow-auto">
                        <Suspense fallback={<Loader />}>
                            <CustomTable
                                columns={columns}
                                data={allMenuList}
                                currentPage={currentPage}
                                recordsPerPage={recordsPerPage}
                                totalRecords={menuList.length}
                                handlePageChange={handlePageChange}
                                onDelete={onDelete}
                                showDeleteButton={true}
                                showUpdateButton={true}
                                onEdit={handleSaveEdit}
                            // showDeleteButton={permissionFlags?.showDELETE}
                            // showUpdateButton={permissionFlags?.showUPDATE}
                            />
                        </Suspense>
                    </Card.Body>
                </Card>
            </Col>

        </Row>
    );
};

export default AddMenu;