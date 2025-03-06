import React from "react";
import { Modal, Button, Col, Form, InputGroup } from "react-bootstrap";
import { Formik, Form as FormikForm, Field, ErrorMessage } from "formik";
import DatePicker from "react-datepicker";
import Select from "react-select";

const CreateTaskModel = React.memo(({ show, handleClose, employeeData, Option2, handleSubmit, validationSchema }) => {
    return (
        <Modal show={show} onHide={handleClose} className="fade" id="addtask" tabIndex={-1} aria-hidden="true">
            <Formik
                initialValues={{
                    taskName: "",
                    service: "",
                    assignedTo: [],
                    assignedDate: null,
                    targetDate: null,
                    priority: "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
            >
                {({ values, setFieldValue }) => (
                    <FormikForm>
                        <Modal.Header closeButton>
                            <h6 className="modal-title" id="mail-ComposeLabel">Create Task</h6>
                        </Modal.Header>
                        <Modal.Body className="px-4">
                            <div className="row gy-2">
                                {/* Task Name */}
                                <Col xl={12}>
                                    <label htmlFor="taskName" className="form-label">Task Name</label>
                                    <Field type="text" name="taskName" className="form-control" placeholder="Task Name" />
                                    <ErrorMessage name="taskName" component="div" className="text-danger" />
                                </Col>

                                {/* Service */}
                                <Col xl={12}>
                                    <label htmlFor="service" className="form-label">Enter Service</label>
                                    <Field type="text" name="service" className="form-control" placeholder="Service" />
                                    <ErrorMessage name="service" component="div" className="text-danger" />
                                </Col>

                                {/* Assigned To */}
                                <Col xl={12}>
                                    <label className="form-label">Assigned To</label>
                                    <Select
                                        isMulti
                                        options={employeeData}
                                        className="!p-0 ti-form-select !rounded-s-none"
                                        menuPlacement="auto"
                                        classNamePrefix="Select2"
                                        onChange={(selected) => setFieldValue("assignedTo", selected)}
                                    />
                                    <ErrorMessage name="assignedTo" component="div" className="text-danger" />
                                </Col>

                                {/* Assigned Date */}
                                <Col xl={6}>
                                    <label className="form-label">Assigned Date</label>
                                    <Form.Group>
                                        <InputGroup>
                                            <div className="input-group-text text-muted">
                                                <i className="ri-calendar-line"></i>
                                            </div>
                                            <DatePicker
                                                selected={values.assignedDate}
                                                onChange={(date) => setFieldValue("assignedDate", date)}
                                                placeholderText="Choose date"
                                                className="form-control"
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                    <ErrorMessage name="assignedDate" component="div" className="text-danger" />
                                </Col>

                                {/* Target Date */}
                                <Col xl={6}>
                                    <label className="form-label">Target Date</label>
                                    <Form.Group>
                                        <InputGroup>
                                            <div className="input-group-text text-muted">
                                                <i className="ri-calendar-line"></i>
                                            </div>
                                            <DatePicker
                                                selected={values.targetDate}
                                                onChange={(date) => setFieldValue("targetDate", date)}
                                                placeholderText="Choose date"
                                                className="form-control"
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                    <ErrorMessage name="targetDate" component="div" className="text-danger" />
                                </Col>

                                {/* Priority */}
                                <Col xl={12}>
                                    <label className="form-label">Priority</label>
                                    <Select
                                        options={Option2}
                                        className="js-example-placeholder-multiple w-full js-states"
                                        menuPlacement="auto"
                                        classNamePrefix="Select2"
                                        isSearchable
                                        onChange={(selected) => setFieldValue("priority", selected.value)}
                                    />
                                    <ErrorMessage name="priority" component="div" className="text-danger" />
                                </Col>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="light" type="button" onClick={handleClose} data-bs-dismiss="modal">Cancel</Button>
                            <Button variant="primary" type="submit">Create</Button>
                        </Modal.Footer>
                    </FormikForm>
                )}
            </Formik>
        </Modal>
    );
});

export default CreateTaskModel;
