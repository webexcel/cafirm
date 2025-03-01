import React, { useState } from "react";
import { Table, Button, Form, Row, Col, Card, Modal } from "react-bootstrap";
import DatePicker from "react-datepicker";

const EmployeeTimesheet = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [filter, setFilter] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [data, setData] = useState([
    { id: 1, employee: "John Doe", date: "2025-02-28", hours: 8, task: "Task A" },
    { id: 2, employee: "Jane Smith", date: "2025-02-28", hours: 7, task: "Task B" },
  ]);

  const totalHours = data.reduce((sum, row) => sum + row.hours, 0);

  return (
    <>
      <Card>
        <Card.Body>
          <Row className="mb-3">
            <Col>
              <Form.Label>Start Date</Form.Label>
              <DatePicker selected={startDate} onChange={(date) => setStartDate(date)} className="form-control" />
            </Col>
            <Col>
              <Form.Label>End Date</Form.Label>
              <DatePicker selected={endDate} onChange={(date) => setEndDate(date)} className="form-control" />
            </Col>
            <Col>
              <Form.Label>Employee</Form.Label>
              <Form.Control type="text" placeholder="Enter employee name" onChange={(e) => setFilter(e.target.value)} />
            </Col>
            <Col className="d-flex align-items-end">
              <Button variant="primary" className="me-2 my-1 btn btn-md px-4 py-1">Submit</Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>

          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>Employee</th>
                <th>Date</th>
                <th>Hours</th>
                <th>Task</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.filter(row => row.employee.toLowerCase().includes(filter.toLowerCase())).map(row => (
                <tr key={row.id}>
                  <td>{row.id}</td>
                  <td>{row.employee}</td>
                  <td>{row.date}</td>
                  <td>{row.hours}</td>
                  <td>{row.task}</td>
                  <td>
                    <Button variant="primary" className='btn btn-sm' onClick={() => setModalShow(true)}>
                      &#9776;
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Button variant="primary" className="me-2 mt-3 btn btn-sm">Export to CSV</Button>
          <Button variant="secondary" className="me-2 mt-3 btn btn-sm">Export to PDF</Button>
        </Card.Body>
      </Card>

      <Modal show={modalShow} onHide={() => setModalShow(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Time Sheet for the Tasks</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered>
            <thead>
              <tr>
                <th>Start Date</th>
                <th>Start Time</th>
                <th>End Date</th>
                <th>End Time</th>
                <th>Total Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>2025-02-28</td>
                <td>09:00 AM</td>
                <td>2025-02-28</td>
                <td>05:00 PM</td>
                <td>8h</td>
              </tr>
              <tr>
                <td colSpan="4" className="text-end"><strong>Total</strong></td>
                <td><strong>{totalHours}h</strong></td>
              </tr>
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EmployeeTimesheet;