import React from "react";
import { Modal, Button, Col, Form, InputGroup } from "react-bootstrap";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import DatePicker from "react-datepicker";
import Select from "react-select";

const CustomModal = React.memo(({
    show,
    handleClose,
    handleSubmit,
    validationSchema,
    initialValues,
    formFields,
    modalTitle
}) => {
    const [menuIsOpen, setMenuIsOpen] = React.useState({});

    const handleMenuOpen = (name) => {
        setMenuIsOpen((prev) => ({ ...prev, [name]: true }));
    };

    const handleMenuClose = (name) => {
        setMenuIsOpen((prev) => ({ ...prev, [name]: false }));
    };

    return (
        <Modal show={show} onHide={handleClose} className="fade" id="addtask" tabIndex={-1} aria-hidden="true" size="lg">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                validateOnChange={true}
                validateOnBlur={true}
            >
                {({ values, setFieldValue, errors, touched }) => {
                    console.log("Formik values:", values);
                    console.log("Formik errors:", errors);
                    console.log("Touched fields:", touched);

                    return (
                        <FormikForm>
                            <Modal.Header closeButton>
                                <h5 className="modal-title" id="mail-ComposeLabel">{modalTitle}</h5>
                            </Modal.Header>
                            <Modal.Body className="p-4">
                                <div className="row gy-3">
                                    {formFields.map(({ name, label, placeholder, type, options, disable, collength }) => (
                                        <Col xl={collength} key={name}>
                                            <label htmlFor={name} className="form-label">{label}</label>
                                            {(() => {
                                                switch (type) {
                                                    case 'dropdown':
                                                        return (
                                                            <Select
                                                                options={options}
                                                                classNamePrefix="Select2"
                                                                menuPlacement="auto"
                                                                isSearchable
                                                                onChange={(selected) =>
                                                                    setFieldValue(name, String(selected?.value) || "")
                                                                }
                                                                isDisabled={disable}
                                                                defaultValue={options.find(option => String(option.value) === String(values[name]))}
                                                                menuIsOpen={menuIsOpen[name] || false}
                                                                onMenuOpen={() => handleMenuOpen(name)}
                                                                onMenuClose={() => handleMenuClose(name)}
                                                            />
                                                        );

                                                    case "multiSelect":
                                                        return (
                                                            <Select
                                                                isMulti
                                                                name={name}
                                                                options={options}
                                                                value={values[name] || []}
                                                                className="js-example-placeholder-multiple w-full js-states"
                                                                menuPlacement="auto"
                                                                classNamePrefix="Select2"
                                                                placeholder={placeholder}
                                                                isDisabled={disable}
                                                                onChange={(selected) => setFieldValue(name, selected)}
                                                                menuIsOpen={menuIsOpen[name] || false}
                                                                onMenuOpen={() => handleMenuOpen(name)}
                                                                onMenuClose={() => handleMenuClose(name)}
                                                                isClearable
                                                            />
                                                        );

                                                    case "multiSelect":
                                                        return (
                                                            <Select
                                                                isMulti
                                                                name={name}
                                                                options={options}
                                                                value={formData[name] || ""}
                                                                className="js-example-placeholder-multiple w-full js-states"
                                                                menuPlacement="auto"
                                                                classNamePrefix="Select2"
                                                                placeholder={placeholder}
                                                                onChange={(e) => onChange(e, name)}
                                                                isInvalid={!!errors[name]}
                                                                style={{ width: "100%", minHeight: "50px" }}
                                                            />
                                                        );


                                                    case 'date':
                                                        return (
                                                            <Form.Group className="w-100">
                                                                <InputGroup className="w-100">
                                                                    <div className="input-group-text text-muted">
                                                                        <i className="ri-calendar-line"></i>
                                                                    </div>
                                                                    <div className="w-100">
                                                                        <DatePicker
                                                                            selected={values[name]}
                                                                            onChange={(date) => setFieldValue(name, date)}
                                                                            placeholderText={placeholder}
                                                                            className="form-control w-100"
                                                                            disabled={disable}
                                                                            dateFormat="yyyy/MM/dd"
                                                                        />
                                                                    </div>
                                                                </InputGroup>
                                                            </Form.Group>
                                                        );

                                                    case "searchable_dropdown":
                                                        return (
                                                            <Select
                                                                name={name}
                                                                defaultValue={options.find(option => String(option.value) === String(values[name]))}
                                                                onChange={(selected) =>
                                                                    setFieldValue(name, String(selected?.value) || "")
                                                                }
                                                                options={options}
                                                                isSearchable
                                                                placeholder={`Select ${label}`}
                                                                styles={{
                                                                    control: (provided, state) => ({
                                                                        ...provided,
                                                                        width: '100%',
                                                                        borderColor: state.isFocused ? 'transparent' : provided.borderColor,
                                                                        '&:hover': {
                                                                            borderColor: provided.borderColor
                                                                        }
                                                                    })
                                                                }}
                                                            />
                                                        );

                                                    case "text":
                                                        return (
                                                            <Field
                                                                type="text"
                                                                name={name}
                                                                className="form-control"
                                                                placeholder={placeholder}
                                                                disabled={disable}
                                                            />
                                                        );

                                                    case "number":
                                                        return (
                                                            <Field
                                                                type="number"
                                                                name={name}
                                                                className="form-control"
                                                                placeholder={placeholder}
                                                                disabled={disable}
                                                            />
                                                        );

                                                    case "textarea":
                                                        return (
                                                            <Field
                                                                as="textarea"
                                                                name={name}
                                                                placeholder={placeholder}
                                                                rows={1}
                                                                disabled={disable}
                                                                className="form-control w-100"
                                                            />
                                                        );


                                                    default:
                                                        return null;
                                                }
                                            })()}
                                            <ErrorMessage name={name} component="div" className="text-danger mt-1" />
                                        </Col>
                                    ))}
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" type="button" onClick={handleClose} data-bs-dismiss="modal">Cancel</Button>
                                <Button variant="primary" type="submit">Save</Button>
                            </Modal.Footer>
                        </FormikForm>
                    );
                }}
            </Formik>
        </Modal>
    );
});

export default CustomModal;
