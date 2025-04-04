import React, { Fragment, useCallback, useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";
import { Modal, Card, Button, Form, Col, Row } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import ColorPicker from '../../components/colorpicker/ColorPickerList'
import ImageSelectorfrom from '../../components/imageselector/ImageSelector'
import { addCalendarEvent, deleteCalendarEvent, editCalendarEvent, getCalendarList } from "../../service/calendarServices";

const getCalenderObj = (id, title, color, start, end, description) => {
    return {
        id, title, color, start, end, description
    }
}
const Calender = () => {
    const [modalShow, setModalShow] = useState(false);

    const [modalEditShow, setModalEditShow] = useState(false)

    const [selectedDate, setSelectedDate] = useState(null);

    const [events, setEvents] = useState([]);

    const [selectedColor, setSelectedColor] = useState("");

    const [selectedImage, setSelectedImage] = useState("");

    let eventGuid = 0;

    const todayStr = new Date().toISOString().replace(/T.*$/, "");

    // const yearId = useSelector(state => state.yearId);

    const INITIAL_EVENTS = [
        {
            id: 57,
            title: "Meeting222",
            // calenderImage: sampleImg,
            start: "2024-11-18",
            end: "2024-11-22",
            color: 'blue'
        },
        {
            id: createEventId(),
            title: "Meeting Time",
            // calenderImage: sampleImg,
            start: "2025-03-16T18:30:00.000Z",
            end: "2025-03-22T18:30:00.000Z",
            color: 'blue'

        },
        {
            id: createEventId(),
            title: "test",
            start: " 2024-11-17" + "T20:00:00",
        },
        {

            calenderImage: "",
            color: "red",
            end
                :
                "2019-01-24",
            id
                :
                58,
            start
                :
                "2019-01-23",
            title
                :
                "parentalert",
        },
        {
            id: 58,
            title: "parentalert",
            calenderImage: "",
            start: "2019-01-24T18:30:00.000Z",
            end: "2019-01-23",
            color: 'red'
        }

    ];

    const getCalenderService = useCallback(async () => {
        try {
            setEvents([])
            const response = await getCalendarList();
            console.log('response calender', response.data.data)
            if (response.data.status) {
                const setDataToCalList = await response.data.data.map((data) => {
                    setEvents(prev => [...prev,
                    getCalenderObj(
                        data.cal_id,
                        data.title,
                        data.color,
                        data.start_date,
                        data.end_date,
                        data.description
                    )
                    ])
                })

            }

        } catch (error) {
            console.error("GET Calender Failed:", error);
        }
    }, []);

    useEffect(() => {
        getCalenderService();
    }, [getCalenderService]);

    const renderEventContent = (eventInfo) => {
        const { title } = eventInfo.event;
        const imageUrl = eventInfo.event.extendedProps.calenderImage;

        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt=""
                        style={{
                            width: '25px',
                            height: '25px',
                            marginRight: '8px',
                            borderRadius: '50%', // Optional for rounded image
                        }}
                    />
                )}
                <span>{title}</span>
            </div>
        );
    };

    function createEventId() {
        return String(eventGuid++);
    }

    // useEffect(() => {
    // 	const draggableEl = document.getElementById("external-events");
    // 	new Draggable(draggableEl, {
    // 		itemSelector: ".fc-event",
    // 		eventData: function (eventEl) {
    // 			const title = eventEl.getAttribute("title");
    // 			const id = eventEl.getAttribute("data");
    // 			const classValue = eventEl.getAttribute("class");
    // 			return {
    // 				title: title,
    // 				id: id,
    // 				className: classValue,
    // 			};
    // 		},
    // 	});
    // }, []);

    const handleEvents = () => { };

    const formik = useFormik({
        initialValues: {
            title: "",
            start: "",
            end: "",
            description: ""
        },
        validationSchema: Yup.object({
            title: Yup.string().required("Title is required"),
            start: Yup.string().required("Start date is required"),
            end: Yup.string().required("End date is required"),
            description: Yup.string().required("Description is required"),
        }),
        onSubmit: async (values) => {

            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: "btn btn-success ms-2",
                    cancelButton: "btn btn-danger"
                },
                buttonsStyling: false
            });

            swalWithBootstrapButtons.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, Add it!",
                cancelButtonText: "No, cancel!",
                reverseButtons: true
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {

                        const payload = {
                            title: formik.values.title,
                            // calendarImage: "Test URL",
                            start_date: formik.values.start,
                            end_date: formik.values.end,
                            color: selectedColor,
                            description: formik.values.description
                        };

                        const response = await addCalendarEvent(payload);
                        if (response.data.status) {
                            // setEvents((prevEvents) => [...prevEvents, {
                            //     ...payload,
                            //     start: formik.values.start,
                            //     end: formik.values.end,
                            //     // color: selectedColor
                            // }]);
                            getCalenderService()
                            setModalShow(false);
                            Swal.fire("Success", `Event added successfully`, "success");
                        }

                        console.log('add event response', response)
                    }
                    catch (error) {
                        Swal.fire("Error", error.response?.data?.message || "Failed to add event.", "error");
                        console.log('Create Event error  ', error)
                    }

                } else if (
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    swalWithBootstrapButtons.fire(
                        "Cancelled",
                        "Your imaginary data is safe :)",
                        "error"
                    );
                }
            });


        },
    });

    const editformik = useFormik({
        initialValues: {
            edit_title: "",
            // color: "",
            calenderid: "",
            iseventdeleted: false,
            start: "",
            end: "",
            description: ""
        },
        validationSchema: Yup.object({
            edit_title: Yup.string().required("Title is required"),
        }),
        onSubmit: async (values) => {

            const swalWithBootstrapButtons = Swal.mixin({
                customClass: {
                    confirmButton: "btn btn-success ms-2",
                    cancelButton: "btn btn-danger"
                },
                buttonsStyling: false
            });

            swalWithBootstrapButtons.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: `${editformik.values.iseventdeleted ? "Yes Delete it!" : "Yes Update it!"}`,
                cancelButtonText: "No, cancel!",
                reverseButtons: true
            }).then(async (result) => {
                if (result.isConfirmed) {
                    try {

                        if (editformik.values.iseventdeleted) {
                            try {
                                const payload = {
                                    "evt_id": editformik.values.calenderid
                                }
                                const response = await deleteCalendarEvent(payload)
                                if (response.data.status) {
                                    getCalenderService()
                                    setModalEditShow(false);
                                    Swal.fire("Success", `Event edited successfully`, "success");
                                }
                            }
                            catch (error) {
                                Swal.fire("Error", error.response?.data?.message || "Failed to add event.", "error");
                                console.log("error occurs while delete event : ", error)
                            }
                            console.log("event deleted")
                            return;
                        }

                        const payload = {
                            "evt_id": editformik.values.calenderid,
                            "title": editformik.values.edit_title,
                            "description": editformik.values.description,
                            "start_date": editformik.values.start,
                            "end_date": editformik.values.end
                        };

                        const response = await editCalendarEvent(payload);

                        if (response.data.status) {
                            // setEvents((prevEvents) => [...prevEvents, {
                            //     ...payload,
                            //     start: formik.values.start,
                            //     end: formik.values.end,
                            //     // color: selectedColor
                            // }]);
                            getCalenderService()
                            editformik.resetForm()
                            setModalEditShow(false);
                            Swal.fire("Success", `Event edited successfully`, "success");
                        }

                        console.log("event edited")
                    }
                    catch (error) {
                        Swal.fire("Error", error.response?.data?.message || "Failed to edit event.", "error");
                        console.log('Edit Event error  ', error)
                    }

                } else if (
                    result.dismiss === Swal.DismissReason.cancel
                ) {
                    swalWithBootstrapButtons.fire(
                        "Cancelled",
                        "Your imaginary data is safe :)",
                        "error"
                    );
                }
            });


        },
    });

    //edit
    const handleEventClick = (clickInfo) => {
        editformik.resetForm()
        editformik.setFieldValue('iseventdeleted', false)
        console.log('edit table valueee', clickInfo.event._def.publicId, events)
        const selectedId = clickInfo.event._def.publicId
        const filterData = events.filter(data => Number(data.id) === Number(selectedId))
        console.log('checkkkk', filterData[0])
        editformik.setFieldValue('calenderid', filterData[0].id)
        editformik.setFieldValue('edit_title', filterData[0].title)
        editformik.setFieldValue('description', filterData[0].description)
        editformik.setFieldValue('start', String(filterData[0].start).split('T')[0])
        editformik.setFieldValue('end', String(filterData[0].end).split('T')[0])
        setModalEditShow(true)

    };

    // Helper function to format date to "yyyy-MM-ddThh:mm"
    const formatDateToLocalString = (date) => {
        const localDate = new Date(date);
        return localDate.toISOString().slice(0, 16); // Get the format yyyy-MM-ddThh:mm
    };
    const formatDateToISO = (date) => {
        const d = new Date(date);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`; // Format: YYYY-MM-DD
    };


    const handleDateSelect = (selectInfo) => {
        formik.resetForm()
        setSelectedDate(selectInfo);
        console.log('checkkkkk date', selectInfo.startStr)
        // formik.setFieldValue("start", formatDateToLocalString(selectInfo.startStr));
        // formik.setFieldValue("end", formatDateToLocalString(selectInfo.endStr));
        formik.setFieldValue("start", formatDateToISO(selectInfo.startStr));
        formik.setFieldValue("end", formatDateToISO(selectInfo.endStr));
        setModalShow(true);

        console.log('checkkkkkk', selectInfo)
    };

    const handleCheckboxChange = (event) => {
        const isCheckedValue = event.target.checked;
        console.log("Checkbox is checked:", isCheckedValue);
        editformik.setFieldValue('iseventdeleted', isCheckedValue)
    };

    return (

        <Fragment>

            <Row>
                <Col xl={12}>
                    <Card className="custom-card">
                        <Card.Header>
                            <Card.Title>Full Calendar</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <div id='calendar2'>
                                <FullCalendar
                                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                                    headerToolbar={{
                                        left: "prev,next today",
                                        center: "title", right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek"
                                    }}
                                    initialView="dayGridMonth"
                                    events={events}
                                    select={handleDateSelect}
                                    selectable={true}
                                    editable={true}
                                    selectMirror={true}
                                    dayMaxEvents={true}
                                    eventContent={renderEventContent}
                                    eventClick={handleEventClick}
                                    eventsSet={handleEvents}
                                />
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

            </Row>

            {/* Event create model  */}
            <Modal show={modalShow} size="lg" onHide={() => setModalShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Create Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={formik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <Row className="gap-2">
                            <Col md={12}>
                                <Form.Group controlId="title">
                                    <Form.Label>Event Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="title"
                                        value={formik.values.title}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={formik.touched.title && formik.errors.title}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formik.errors.title}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group controlId="description">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="description"
                                        value={formik.values.description}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={formik.touched.description && formik.errors.description}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formik.errors.description}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="start">
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control
                                        // type="datetime-local"
                                        type="date"
                                        name="start"
                                        value={formik.values.start}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={formik.touched.start && formik.errors.start}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formik.errors.start}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="end">
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control
                                        // type="datetime-local"
                                        type="date"
                                        name="end"
                                        value={formik.values.end}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                        isInvalid={formik.touched.end && formik.errors.end}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {formik.errors.end}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <ColorPicker onChangeColor={setSelectedColor} />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                {/* <ImageSelector onImageSelect={setSelectedImage} /> */}

                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Button variant="primary" type="submit" className="mt-1 mb-1">
                                    Save Event
                                </Button>

                            </Col>
                        </Row>

                    </Form>
                </Modal.Body>
            </Modal>

            {/* Event edit model */}
            <Modal show={modalEditShow} size="lg" onHide={() => setModalEditShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Event</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={editformik.handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <Row className="gap-2">
                            <Col>
                                <Form.Group controlId="edittitle">
                                    <Form.Label>Event Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="edit_title"
                                        value={editformik.values.edit_title}
                                        onChange={editformik.handleChange}
                                        onBlur={editformik.handleBlur}
                                        isInvalid={editformik.touched.edit_title && editformik.errors.edit_title}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {editformik.errors.edit_title}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col md={12}>
                                <Form.Group controlId="description">
                                    <Form.Label>Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="description"
                                        value={editformik.values.description}
                                        onChange={editformik.handleChange}
                                        onBlur={editformik.handleBlur}
                                        isInvalid={editformik.touched.description && editformik.errors.description}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {editformik.errors.description}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            {/* <Col>
                                <ColorPicker onChangeColor={setSelectedColor}
                                    defaultColor={editformik.values.color} />
                            </Col> */}
                        </Row>
                        <Row>
                            <Col>
                                <Form.Group controlId="start">
                                    <Form.Label>Start Date</Form.Label>
                                    <Form.Control
                                        // type="datetime-local"
                                        type="date"
                                        name="start"
                                        value={editformik.values.start}
                                        onChange={editformik.handleChange}
                                        onBlur={editformik.handleBlur}
                                        isInvalid={editformik.touched.start && editformik.errors.start}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {editformik.errors.start}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                            <Col>
                                <Form.Group controlId="end">
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control
                                        // type="datetime-local"
                                        type="date"
                                        name="end"
                                        value={editformik.values.end}
                                        onChange={editformik.handleChange}
                                        onBlur={editformik.handleBlur}
                                        isInvalid={editformik.touched.end && editformik.errors.end}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {editformik.errors.end}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Col>
                        </Row>
                        {/* <Row>
                            <Col>
                                <ColorPicker onChangeColor={setSelectedColor} />
                            </Col>
                        </Row> */}

                        <Row>
                            <Col className="pb-2">
                                <Form.Check className="form-check-md d-flex align-items-center"
                                    type="checkbox"
                                    defaultChecked={editformik.values.iseventdeleted}
                                    onChange={handleCheckboxChange}
                                    id="checkebox-md"
                                    label="Delete Event" />
                            </Col>
                        </Row>

                        <Row>
                            <Col>
                                {
                                    editformik.values.iseventdeleted ? <Button variant="danger" type="submit" className="mt-1 mb-1">
                                        Delete Event
                                    </Button> : <Button variant="primary" type="submit" className="mt-1 mb-1">
                                        Edit Event
                                    </Button>
                                }


                            </Col>
                        </Row>

                    </Form>
                </Modal.Body>
            </Modal>

        </Fragment>
    );
};

export default Calender;
