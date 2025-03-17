import { useState, useEffect, Fragment, Suspense, useCallback } from "react";
import { Row, Col, Card, Button, Form } from "react-bootstrap";
import Loader from "../../components/common/loader/loader";
import CustomTable from "../../components/custom/table/CustomTable";
import { addAttendanceLogin, addAttendanceLogout, getActivityAttendance } from "../../service/attendance/activityTracker";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import Swal from "sweetalert2";
import Cookies from 'js-cookie';

export default function ActivityTracker() {
  const [time, setTime] = useState(localStorage.getItem("time") ? Number(localStorage.getItem("time")) : 0);
  const [isRunning, setIsRunning] = useState(localStorage.getItem("isRunning") === "true");
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(15);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const today = new Date();

  // Timer Logic
  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else {
      clearInterval(timer);
    }
    return () => clearInterval(timer);
  }, [isRunning]);

  // Save state to localStorage
  useEffect(() => {
    localStorage.setItem("time", time);
    localStorage.setItem("isRunning", isRunning);
  }, [time, isRunning]);

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const getTrackerAttendanceData = async (date) => {
    try {
      const payload = { date };
      const response = await getActivityAttendance(payload);
      const addSno = response?.data?.data?.map((data, index) => ({
        sno: index + 1,
        ...data,
        login_date: String(data.login_date).split("T")[0],
        logout_date: String(data.logout_date).split("T")[0],
        login_time: String(data.login_time).split(":").slice(0, 2).join(":"),
        logout_time: String(data.logout_time).split(":").slice(0, 2).join(":"),
      }));
      setFilteredData(addSno);
    } catch (error) {
      console.error("Error fetching tracker data:", error);
    }
  };

  useEffect(() => {
    getTrackerAttendanceData(today.toISOString().split("T")[0]);
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { date: selectedDate.toISOString().split("T")[0] };
      const response = await getActivityAttendance(payload);
      if (!response.data.status) {
        return Swal.fire("Error", response.data.message || "Failed to get worksheet.", "error");
      }
      const addSno = response?.data?.data?.map((data, index) => ({
        sno: index + 1,
        ...data,
        login_date: String(data.login_date).split("T")[0],
        logout_date: String(data.logout_date).split("T")[0],
        login_time: String(data.login_time).split(":").slice(0, 2).join(":"),
        logout_time: String(data.logout_time).split(":").slice(0, 2).join(":"),
      }));
      setFilteredData(addSno);
    } catch (err) {
      setFilteredData([])
      console.error("Error while get activity data:", err.stack);
      Swal.fire("Error", err.response?.data?.message || "Failed to get activity data.", "error");
    }

  };

  // Page Change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Handle Login API
  const handleLoginApi = async () => {
    try {
      const userData = JSON.parse(Cookies.get('user'));
      const now = new Date();
      const payload = {
        "emp_id": userData.employee_id || '',
        "start_time": now.toTimeString().split(' ')[0],
        "start_date": now.toISOString().split('T')[0]
      };

      const response = await addAttendanceLogin(payload);
      if (response.data.status) {
        localStorage.setItem("recordID", response.data.data);
        setIsRunning(true);
      }
      // Swal.fire("Success", response.data.message || "Logged in successfully.", "success");
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Failed to start timer.", "error");
    }
  };


  // Handle Logout API
  const handleLogoutApi = async () => {

    try {
      const now = new Date();
      const id = localStorage.getItem("recordID")
      const payload = {
        "att_id": id,
        "logout_date": now.toISOString().split('T')[0],
        "logout_time": now.toTimeString().split(' ')[0],
      };
      const response = await addAttendanceLogout(payload);

      if (response.data.status) {
        setIsRunning(false);
        getTrackerAttendanceData(today.toISOString().split("T")[0])
        //   Swal.fire("Success", response.data.message || "Logged out successfully.", "success");
      }
    } catch (error) {
      Swal.fire("Error", error.response?.data?.message || "Failed to stop timer.", "error");
    }
  };

  // Handle Attendance (Single Button)
  const handleAttendance = async () => {
    if (isRunning) {
      await handleLogoutApi(); // If running → Call logout API
    } else {
      await handleLoginApi(); // If not running → Call login API
    }
  };

  // Handle Delete
  const onDelete = useCallback(async (updatedData, index) => {
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
        const payload = { id: updatedData?.employee_id || "" };
        const response = await deleteEmployee(payload);
        if (response.data.status) {
          const newFilteredData = filteredData
            .filter((item, ind) => ind !== index)
            .map((item, ind) => ({ ...item, sno: ind + 1 }));

          setFilteredData(newFilteredData);

          Swal.fire("Deleted!", response?.data?.message || "Employee deleted successfully.", "success");
        }
      } catch (error) {
        Swal.fire("Error", error.response?.data?.message || "Failed to delete employee.", "error");
      }
    }
  }, [filteredData]);

  return (
    <Fragment>
      <Row>
        <Col xl={12}>
          <div className="card shadow-md border-0 rounded-3 py-3 px-3 d-flex flex-row justify-content-between align-items-center">
            {/* Left Side: Timer & Button */}
            <div className="d-flex align-items-center gap-3">
              <i className="bi bi-stopwatch-fill display-6 text-primary"></i>
              <h1 className="display-5 fw-bold text-dark m-0">
                {formatTime(time)}
              </h1>
              <Button
                variant={isRunning ? "danger" : "success"}
                className="d-flex align-items-center gap-2 btn btn-sm px-3 py-1"
                onClick={handleAttendance}
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

      {/* Data Table */}
      <Card className="custom-card p-3 mt-4">
        <Card.Body className="overflow-auto">
          <Suspense fallback={<Loader />}>
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
              onDelete={onDelete}
            />
          </Suspense>
        </Card.Body>
      </Card>
    </Fragment>
  );
}
