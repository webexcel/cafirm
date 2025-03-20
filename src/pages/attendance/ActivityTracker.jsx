import { useAttendanceContext } from "../../contexts";
import { Row, Col, Card, Button, Form } from "react-bootstrap";
import CustomTable from "../../components/custom/table/CustomTable";
import { useState, Fragment, Suspense, useEffect } from "react";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import { getActivityAttendance } from "../../service/attendance/activityTracker";

export default function ActivityTracker() {
  const { time, isRunning, handleLogin, handleLogout } = useAttendanceContext();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(15);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handleAttendance = () => {
    const date = selectedDate.toISOString().split('T')[0];

    const action = isRunning ? handleLogout() : handleLogin();

    return action.then(() => getTrackerAttendanceData(date));
  };


  const getTrackerAttendanceData = async (date) => {
    try {
      const payload = { date };
      const response = await getActivityAttendance(payload);

      let data = response?.data?.data || [];
      console.log("Last record check:", data.slice(-1)[0]);
      if (data.slice(-1)[0]?.logout_time === null) {
        data = data.slice(0, -1);
      }

      const formattedData = data.map((data, index) => ({
        sno: index + 1,
        ...data,
        login_date: data?.login_date?.split("T")[0] || "",
        logout_date: data?.logout_date?.split("T")[0] || "",
        login_time: data?.login_time?.split(":").slice(0, 2).join(":") || "",
        logout_time: data?.logout_time?.split(":").slice(0, 2).join(":") || "",
      }));

      setFilteredData(formattedData);
    } catch (error) {
      console.error("Error fetching tracker data:", error);
    }
  };

  useEffect(() => {
    getTrackerAttendanceData(selectedDate.toISOString().split('T')[0]);
  }, [])

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDateChange = (date) => { setSelectedDate(date) }

  useEffect(() => {
    getTrackerAttendanceData(selectedDate.toISOString().split('T')[0]);
  }, [selectedDate]);

  const handleSubmit = (event) => {
    event.preventDefault();
    getTrackerAttendanceData(selectedDate.toISOString().split('T')[0]);
  };


  return (
    <Fragment>
      <Row>
        <Col xl={12}>
          <div className="card shadow-md border-0 rounded-3 py-3 px-3 d-flex flex-row justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-3">
              <i className="bi bi-stopwatch-fill display-6 text-primary"></i>
              <h1 className="display-5 fw-bold text-dark m-0">
                {formatTime(time)}
              </h1>
              <Button
                variant={isRunning ? "danger" : "success"}
                onClick={handleAttendance}
                className="d-flex align-items-center gap-2 btn btn-sm px-3 py-1"
              >
                <span>{isRunning ? "Logout" : "Login"}</span>
                <i className={`bi ${isRunning ? "bi-pause-fill" : "bi-play-fill"} fs-5`}></i>
              </Button>
            </div>

            <div>
              <Form onSubmit={handleSubmit} className="d-flex gap-3">
                <div style={{ position: "relative", display: "inline-block" }}>
                  <DatePicker
                    selected={selectedDate}
                    onChange={handleDateChange}
                    placeholderText="Select Date"
                    dateFormat="yyyy/MM/dd"
                    className="form-control"
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
                <Button type="submit" className="btn btn-sm px-4" variant="primary">
                  Submit
                </Button>
              </Form>
            </div>

          </div>
        </Col>
      </Row>

      <Card className="custom-card p-3 mt-4">
        <Card.Body>
          <Suspense fallback={<div>Loading...</div>}>
            <CustomTable
              columns={[
                { header: "Sno", accessor: "sno" },
                { header: "Start Time", accessor: "login_time" },
                { header: "End Time", accessor: "logout_time" },
                { header: "Total Minutes", accessor: "total_minutes" }
              ]}
              data={filteredData}
              currentPage={currentPage}
              recordsPerPage={recordsPerPage}
              handlePageChange={handlePageChange}
            />
          </Suspense>
        </Card.Body>
      </Card>
    </Fragment>
  );
}
