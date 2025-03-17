import { useState, useEffect, Fragment, Suspense, useCallback } from "react";
import { Row, Col, Card, Button, Form } from "react-bootstrap";
import Loader from "../../components/common/loader/loader";
import CustomTable from "../../components/custom/table/CustomTable";
import { activityTrackersample } from "../../../sampledata.json";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";

export default function ActivityTracker() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [formData, setFormData] = useState("");
  const [filteredData, setFilteredData] = useState(activityTrackersample);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(15);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Submitted: ${formData}`);
    setFormData("");
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const onDelete = useCallback(async (updatedData, index) => {
    console.log("update dataaa", updatedData);

    const result = await Swal.fire({
      title: "Are you sure about removing this employee?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        console.log("update dataa", updatedData);
        const payload = { id: updatedData?.employee_id || "" };
        const response = await deleteEmployee(payload);
        if (response.data.status) {
          const newFilteredData = filteredData
            .filter((item, ind) => ind !== index)
            .map((item, ind) => ({ ...item, sno: ind + 1 }));

          Swal.fire("Deleted!", response?.data?.message || "Employee deleted successfully.", "success");
        }
      } catch (error) {
        Swal.fire("Error", error.response?.data?.message || "Failed to delete employee.", "error");
      }
    }
  }, []);

  return (
    <Fragment>
      <Row>
        <Col xl={12}>
          <div className="card shadow-md border-0 rounded-3 py-3 px-3 d-flex flex-row justify-content-between align-items-center">
            {/* Left Side: Timer & Button */}
            <div className="d-flex align-items-center gap-3">
              <div className="d-flex align-items-center gap-3">
                <i className="bi bi-stopwatch-fill display-6 text-primary"></i>
                <h1 className="display-5 fw-bold text-dark m-0">{formatTime(time)}</h1>
              </div>
              <Button
                variant={isRunning ? "danger" : "success"}
                className="d-flex align-items-center gap-2 btn btn-sm px-3 py-1"
                onClick={() => setIsRunning(!isRunning)}
              >
                <span>{isRunning ? "Logout" : "Login"}</span>
                <i className={`bi ${isRunning ? "bi-pause-fill" : "bi-play-fill"} fs-5`}></i>
              </Button>
            </div>

            <div>
              <Form onSubmit={handleSubmit} className="d-flex gap-3">
              <div
            style={{ position: "relative", display: "inline-block", width: '100%' }}
          >
            <DatePicker
              selected={ new Date()}
              // onChange={(date) => handleDateChange(date, field.name)}
              // placeholderText={field.placeholder}
              className="form-control"
              // isInvalid={formData[field.name] || ""}
            />
            <FaCalendarAlt
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                color: "#6c757d",
              }}
            />
          </div>
                <Button type="submit" className="btn btn-sm px-4" variant="primary">Submit</Button>
              </Form>
            </div>
          </div>
        </Col>
      </Row>

      <Card className="custom-card p-3 mt-4">
        <Card.Body className="overflow-auto">
          <Suspense fallback={<Loader />}>
            <CustomTable
              columns={[
                { header: "Sno", accessor: "sno", editable: false },
                { header: "Start Time", accessor: "start_time", editable: false },
                { header: "End Time", accessor: "end_time", editable: false },
                { header: "Minutes", accessor: "minutes", editable: false },
              ]}
              data={filteredData}
              currentPage={currentPage}
              recordsPerPage={recordsPerPage}
              totalRecords={filteredData.length}
              handlePageChange={handlePageChange}
              onDelete={onDelete}
            />
          </Suspense>
        </Card.Body>
      </Card>
    </Fragment>
  );
}
