import React from "react";
import { Modal, Button, Col, Form, InputGroup } from "react-bootstrap";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import DatePicker from "react-datepicker";
import Select from "react-select";

const CustomModalBox = React.memo(({
    show,
    handleClose,
    handleSubmit,
    validationSchema,
    initialValues,
    formFields
}) => {
    console.log("checkk", initialValues, formFields)
    return (
        <Modal show={show} onHide={handleClose} className="fade" id="addtask" tabIndex={-1} aria-hidden="true">
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue }) => (
                    <FormikForm>
                        <Modal.Header closeButton>
                            <h5 className="modal-title" id="mail-ComposeLabel">Edit Task</h5>
                        </Modal.Header>
                        <Modal.Body className="p-4">
                            <div className="row gy-3">
                                {formFields.map(({ name, label, placeholder, type, options, disable, collength }) => (
                                    <Col xl={collength} key={name}>
                                        <label htmlFor={name} className="form-label">
                                            {label}
                                        </label>
                                        {(() => {

                                            switch (type) {


                                                case 'dropdown':
                                                    return (
                                                        <Select
                                                            options={options}
                                                            classNamePrefix="Select2"
                                                            menuPlacement="auto"
                                                            isSearchable
                                                            onChange={(selected) => setFieldValue(name, selected.value)}
                                                            isDisabled={disable}
                                                            defaultInputValue={options.find(option => String(option.value) === String(values[name]))?.label}
                                                        />
                                                    );
                                                case "multiSelect":
                                                    return (
                                                        <Select
                                                            isMulti
                                                            name={name}
                                                            options={options}
                                                            value={values[name] || ""}
                                                            className="js-example-placeholder-multiple w-full js-states"
                                                            menuPlacement="auto"
                                                            classNamePrefix="Select2"
                                                            placeholder={placeholder}
                                                            isDisabled={disable}
                                                            onChange={(selected) => setFieldValue(name, selected)}
                                                        />
                                                    );

                                                case 'date':
                                                    return (
                                                        <Form.Group>
                                                            <InputGroup>
                                                                <div className="input-group-text text-muted">
                                                                    <i className="ri-calendar-line"></i>
                                                                </div>
                                                                <DatePicker
                                                                    selected={values[name]}
                                                                    onChange={(date) => setFieldValue(name, date)}
                                                                    placeholderText={placeholder}
                                                                    className="form-control w-100"
                                                                    disabled={disable}
                                                                />
                                                            </InputGroup>
                                                        </Form.Group>
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
                )}
            </Formik>
        </Modal>
    );
});

export default CustomModalBox;
