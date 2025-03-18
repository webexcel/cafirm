import React, { useState, Fragment, useEffect } from "react";
import { Card, Form, Row, Col, Button, Modal } from "react-bootstrap";
import CustomForm from "../../../components/custom/form/CustomForm";
import validateCustomForm from "../../../components/custom/form/ValidateForm";
import { CafirmUserMenuField } from "../../../constants/fields/configurationFields";
import {
    getPermissionsList,
    getMenuOperationsList,
    addPermissions,
    getUsersList,
    assignPermission,
    updatePermissions
} from "../../../service/configuration/permissions";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import useForm from "../../../hooks/useForm";
import { usePermission } from "../../../contexts";

const AddPermissions = () => {
    const { permissionId } = useParams();
    const navigate = useNavigate()
    const { fetchPermissions } = usePermission();
    const [formFields, setFormFields] = useState(CafirmUserMenuField);
    const [permissionList, setPermissionList] = useState([]);
    const [menuOperations, setMenuOperations] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [usersList, setUsersList] = useState([]);
    const [editedList, setEditedList] = useState([]);
    const [assignData, setAssignData] = useState({
        userId: "",
        permission_id: "",
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [permissionsResponse, menuOperationsData, usersResponse] =
                    await Promise.all([
                        getPermissionsList(),
                        getMenuOperationsList(),
                        getUsersList(),
                    ]);

                const permissions = permissionsResponse.data.data;
                setPermissionList(permissions);
                setUsersList(usersResponse.data.data);

                let currentEditData = null;
                if (permissionId) {
                    currentEditData = permissions.find(
                        (item) => item.permission_id === Number(permissionId)
                    );
                }

                setEditedList(currentEditData || {});

                const transformedData = transformData(
                    menuOperationsData.data.data,
                    currentEditData
                );
                setMenuOperations(transformedData);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, [permissionId]);

    const initialFormState = CafirmUserMenuField.reduce(
        (acc, field) => ({
            ...acc,
            [field.name]: editedList?.[field.name] || "",
        }),
        {}
    );

    const {
        formData,
        errors,
        handleInputChange,
        validateForm,
        resetForm,
        setFieldValue,
    } = useForm(initialFormState, (data) =>
        validateCustomForm(data, CafirmUserMenuField)
    );

    useEffect(() => {
        if (editedList) {
            Object.keys(editedList).forEach((key) => {
                setFieldValue(key, editedList[key]);
            });
        }
    }, [editedList]);

    const transformData = (data, editdata) => {
        const groupedData = {};

        data.forEach((item) => {
            const { parent_menu, submenu, operation_name, menu_operation_id } = item;

            if (!groupedData[parent_menu]) {
                groupedData[parent_menu] = { operations: [], subMenus: {} };
            }

            if (submenu && submenu !== "undefined") {
                if (!groupedData[parent_menu].subMenus[submenu]) {
                    groupedData[parent_menu].subMenus[submenu] = [];
                }
                groupedData[parent_menu].subMenus[submenu].push({
                    menu_operation_id,
                    operation_name,
                    checked:
                        Array.isArray(editdata?.operations?.[parent_menu]?.[submenu]) &&
                        editdata.operations[parent_menu][submenu].includes(operation_name),
                });
            } else {
                // Direct operations (without submenus)
                groupedData[parent_menu].operations.push({
                    menu_operation_id,
                    operation_name,
                    checked:
                        Array.isArray(editdata?.operations?.[parent_menu]) &&
                        editdata.operations[parent_menu].includes(operation_name),
                });
            }
        });

        return Object.keys(groupedData).map((parentMenu) => ({
            parent_menu: parentMenu,
            checked:
                Object.values(groupedData[parentMenu].subMenus).some((submenu) =>
                    submenu.some((operation) => operation.checked)
                ) || groupedData[parentMenu].operations.some((op) => op.checked),
            subMenus: Object.keys(groupedData[parentMenu].subMenus).map(
                (submenuName) => ({
                    submenu: submenuName,
                    checked: groupedData[parentMenu].subMenus[submenuName].some(
                        (operation) => operation.checked
                    ),
                    operations: groupedData[parentMenu].subMenus[submenuName],
                })
            ),
            operations: groupedData[parentMenu].operations,
        }));
    };


    const handleAdd = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const checkedOperationIds = menuOperations.flatMap((menu) =>
            menu.subMenus.flatMap((subMenu) =>
                subMenu.operations
                    .filter((operation) => operation.checked)
                    .map((operation) => operation.menu_operation_id)
            )
        );

        if (checkedOperationIds.length === 0) {
            Swal.fire({
                text: "Select any menu operation...",
                icon: "warning",
                showCancelButton: true,
                reverseButtons: true,
            });
            return;
        }

        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: `Yes, ${permissionId ? 'Update' : "Add"} it!`,
            cancelButtonText: "No, cancel!",
            reverseButtons: true,
        });

        if (result.isConfirmed) {
            try {

                const { permission_name, description } = formData;

                const payload = {
                    permission_name,
                    description,
                    operations: checkedOperationIds || [],
                };

                let response;

                if (permissionId) {
                    response = await updatePermissions(permissionId, payload);
                } else {
                    response = await addPermissions(payload);
                }

                if (!response.data.status) {
                    return Swal.fire(
                        "Error",
                        response.data.message || "Failed to add school menu.",
                        "error"
                    );
                }

                resetForm();
                Swal.fire("Success", `Permission ${permissionId ? 'updated' : 'added'} successfully!`, "success").then(
                    () => {
                        navigate("/permissions");
                        fetchPermissions();
                    }
                );
            } catch (err) {
                console.error("Error while adding permission:", err.stack);
                return Swal.fire("Error", "Failed to adding permission.", "error");
            }
        }
    };

    const handleMainMenuCheck = (parentMenu) => {
        setMenuOperations((prevMenuOperations) =>
            prevMenuOperations.map((menu) =>
                menu.parent_menu === parentMenu
                    ? {
                        ...menu,
                        checked: !menu.checked,
                        subMenus: menu.subMenus?.map((subMenu) => ({
                            ...subMenu,
                            checked: !menu.checked,
                            operations: subMenu.operations.map((op) => ({
                                ...op,
                                checked: !menu.checked,
                            })),
                        })) || [], // Ensure subMenus is an array
                        operations: menu.operations?.map((op) => ({
                            ...op,
                            checked: !menu.checked,
                        })) || [], // Handle direct operations
                    }
                    : menu
            )
        );
    };

    const handleSubMenuCheck = (submenu, parentMenu) => {
        setMenuOperations((prevMenuOperations) =>
            prevMenuOperations.map((menu) =>
                menu.parent_menu === parentMenu
                    ? {
                        ...menu,
                        subMenus: menu.subMenus?.map((sub) =>
                            sub.submenu === submenu
                                ? {
                                    ...sub,
                                    checked: !sub.checked,
                                    operations: sub.operations.map((op) => ({
                                        ...op,
                                        checked: !sub.checked,
                                    })),
                                }
                                : sub
                        ),
                        // Ensure parent menu is checked if any submenu is checked
                        checked: menu.subMenus?.some((sub) =>
                            sub.submenu === submenu ? !sub.checked : sub.checked
                        ),
                    }
                    : menu
            )
        );
    };

    const handleOperationCheck = (operationId, parentMenu) => {

        setMenuOperations((prevMenuOperations) => {

            const newState = prevMenuOperations.map((menu) => {
                if (menu.parent_menu !== parentMenu) return menu; // Only update the relevant menu

                // Update operations inside parent menu
                const updatedOperations = menu.operations.map((op) =>
                    op.menu_operation_id === operationId
                        ? { ...op, checked: !op.checked }
                        : op
                );

                // Parent is checked if any operation is checked
                const isParentChecked =
                    updatedOperations.some((op) => op.checked) ||
                    menu.subMenus.some((sub) => sub.checked);

                return {
                    ...menu,
                    operations: updatedOperations,
                    checked: isParentChecked,
                };
            });

            return [...newState]; // Ensure new array reference
        });
    };

    const handleAssign = () => {
        resetForm();
        setShowModal(true);
    };

    const handleAssignUser = async () => {
        try {
            const { permission_id, userId } = assignData;

            const payload = {
                permission_id,
                user_id: userId,
            };

            const response = await assignPermission(payload);

            if (!response.data.status) {
                return Swal.fire(
                    "Error",
                    response.data.message || "Failed to assign user.",
                    "error"
                );
            }

            resetForm();
            setShowModal(false);
            setAssignData([]);
            Swal.fire("Success", "Permission assigned successfully!", "success").then(
                () => {
                    navigate("/schoolTreeMenu");
                }
            );
        } catch (err) {
            console.error("Error while assigning permission:", err.stack);
        }
    };

    const handleInputAssignChange = (e) => {
        const { name, value } = e.target;
        setAssignData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    return (
        <Fragment>
            <Row>
                <Col xl={12}>
                    <Card>
                        <Card.Body>
                            <Row className="d-flex">
                                <Col md={9}>
                                    <CustomForm
                                        formFields={formFields}
                                        formData={formData}
                                        errors={errors}
                                        onChange={handleInputChange}
                                        onSubmit={handleAdd}
                                        onEdit={permissionId ? true : false}
                                        showAddButton={true}
                                    />
                                </Col>
                                <Col md={3}>
                                    <Row className="d-flex align-items-start">
                                        <Col md={12} className="d-flex justify-content-end">
                                            <Button
                                                className="btn btn-primary"
                                                onClick={handleAssign}>
                                                Assign
                                            </Button>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row>
                <Col md={12}>
                    <ul className="list-unstyled">
                        <Row>
                            {menuOperations.map((parent) => (
                                <Col xl={12} key={parent.parent_menu}>
                                    <Card className="custom-card py-3 mt-2">
                                        <li>
                                            <div className="form-check">
                                                <Form.Check
                                                    type="checkbox"
                                                    label={parent.parent_menu}
                                                    checked={parent.checked || false}
                                                    onChange={() =>
                                                        handleMainMenuCheck(parent.parent_menu)
                                                    }
                                                />
                                            </div>
                                            {parent.subMenus.length > 0 ? (
                                                parent.subMenus.map((submenu) => (
                                                    <div key={submenu.submenu} className="ms-3">
                                                        <div className="form-check">
                                                            <Form.Check
                                                                type="checkbox"
                                                                label={submenu.submenu}
                                                                checked={submenu.checked || false}
                                                                onChange={() =>
                                                                    handleSubMenuCheck(
                                                                        submenu.submenu,
                                                                        parent.parent_menu
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                        <ul className="list-inline ms-4">
                                                            {submenu.operations.map((operation) => (
                                                                <li
                                                                    key={operation.menu_operation_id}
                                                                    className="list-inline-item"
                                                                    style={{ marginRight: "10px" }}>
                                                                    <div className="form-check">
                                                                        <Form.Check
                                                                            type="checkbox"
                                                                            label={operation.operation_name}
                                                                            checked={operation.checked || false}
                                                                            onChange={() =>
                                                                                handleOperationCheck(
                                                                                    operation.menu_operation_id,
                                                                                    submenu.submenu,
                                                                                    parent.parent_menu
                                                                                )
                                                                            }
                                                                        />
                                                                    </div>
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                ))
                                            ) : (
                                                // Directly show operations if there's no submenu
                                                <ul className="list-inline ms-4">
                                                    {parent.operations.map((operation) => (
                                                        <li
                                                            key={operation.menu_operation_id}
                                                            className="list-inline-item"
                                                            style={{ marginRight: "10px" }}>
                                                            <div className="form-check">
                                                                <Form.Check
                                                                    type="checkbox"
                                                                    label={operation.operation_name}
                                                                    checked={operation.checked || false}
                                                                    onChange={() =>
                                                                        handleOperationCheck(
                                                                            operation.menu_operation_id,
                                                                            parent.parent_menu
                                                                        )
                                                                    }
                                                                />
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </li>
                                    </Card>
                                </Col>
                            ))}
                        </Row>
                    </ul>
                </Col>
            </Row>
            <Modal
                show={showModal}
                onHide={() => {
                    setShowModal(false);
                }}
                centered>
                <Modal.Header closeButton>
                    <Modal.Title>Assign Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Form inside Modal */}
                    <Form>
                        <Form.Group className="mb-3" controlId="formTextBox1">
                            <Form.Select
                                name="userId"
                                value={assignData.userId}
                                onChange={handleInputAssignChange}>
                                <option value="">Select a User</option>
                                {usersList.map((user) => (
                                    <option key={user.UserId} value={user.UserId}>
                                        {user.DisplayName}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formTextBox2">
                            <Form.Select
                                name="permission_id"
                                value={assignData.permission_id}
                                onChange={handleInputAssignChange}>
                                <option value="">Select a Permission</option>
                                {permissionList.map((permission) => (
                                    <option
                                        key={permission.permission_id}
                                        value={permission.permission_id}>
                                        {permission.permission_name}
                                    </option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => {
                            setShowModal(false);
                        }}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAssignUser}>
                        Assign User
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default AddPermissions;
