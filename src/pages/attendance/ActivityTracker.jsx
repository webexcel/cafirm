// import { useState, useEffect, Fragment, Suspense, useCallback } from "react";
// import { Row, Col, Card, Button, Form } from "react-bootstrap";
// import Loader from "../../components/common/loader/loader";
// import CustomTable from "../../components/custom/table/CustomTable";
// import { addAttendanceLogin, addAttendanceLogout, checkTodayAttendance, getActivityAttendance } from "../../service/attendance/activityTracker";
// import DatePicker from "react-datepicker";
// import { FaCalendarAlt } from "react-icons/fa";
// import Swal from "sweetalert2";
// import Cookies from 'js-cookie';

// export default function ActivityTracker() {
//   const [time, setTime] = useState(localStorage.getItem("time") ? Number(localStorage.getItem("time")) : 0);
//   const [isRunning, setIsRunning] = useState(localStorage.getItem("isRunning") === "true");
//   const [filteredData, setFilteredData] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [recordsPerPage] = useState(15);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const today = new Date();
//   const [initialData, setInitalData] = useState(null)
//   const [curentId, setCurrentId] = useState(null)
//   useEffect(() => {
//     let timer;
//     if (isRunning) {
//       timer = setInterval(() => {
//         setTime((prevTime) => prevTime + 1);
//       }, 1000);
//     } else {
//       clearInterval(timer);
//     }
//     return () => clearInterval(timer);
//   }, [isRunning]);

//   useEffect(() => {
//     const checkIntialIns = async () => {
//       try {
//         const userData = JSON.parse(Cookies.get('user'));
//         const payload = {
//           "emp_id": userData?.employee_id || ''
//         }
//         const response = await checkTodayAttendance(payload)
//         console.log("Get Inital dataa : ", response.data.today_work_time)
//         setInitalData(response.data.data[0] || {})
//         // setTime(3600)
//       }
//       catch (error) {
//         console.log("Error occurs while getting get inital value : ", error.stack)
//       }
//     }
//     checkIntialIns()
//   }, [])

//   // Save state to localStorage
//   useEffect(() => {
//     localStorage.setItem("time", time);
//     localStorage.setItem("isRunning", isRunning);
//   }, [time, isRunning]);

//   const formatTime = (totalSeconds) => {
//     const hours = Math.floor(totalSeconds / 3600);
//     const minutes = Math.floor((totalSeconds % 3600) / 60);
//     const seconds = totalSeconds % 60;
//     return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
//   };

//   const getTrackerAttendanceData = async (date) => {
//     try {
//       const payload = { date };
//       const response = await getActivityAttendance(payload);

//       let data = response?.data?.data || [];
//       console.log("Last record check:", data.slice(-1)[0]);
//       if (data.slice(-1)[0]?.logout_time === null && isRunning === false) {
//         data = data.slice(0, -1);
//         setIsRunning(true);
//       }

//       const formattedData = data.map((data, index) => ({
//         sno: index + 1,
//         ...data,
//         login_date: data?.login_date?.split("T")[0] || "",
//         logout_date: data?.logout_date?.split("T")[0] || "",
//         login_time: data?.login_time?.split(":").slice(0, 2).join(":") || "",
//         logout_time: data?.logout_time?.split(":").slice(0, 2).join(":") || "",
//       }));

//       setFilteredData(formattedData);
//     } catch (error) {
//       console.error("Error fetching tracker data:", error);
//     }
//   };

//   useEffect(() => {
//     getTrackerAttendanceData(today.toISOString().split("T")[0]);
//   }, []);

//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const payload = { date: selectedDate.toISOString().split("T")[0] };
//       const response = await getActivityAttendance(payload);
//       if (!response.data.status) {
//         return Swal.fire("Error", response.data.message || "Failed to get worksheet.", "error");
//       }
//       const addSno = response?.data?.data?.map((data, index) => ({
//         sno: index + 1,
//         ...data,
//         login_date: String(data.login_date).split("T")[0],
//         logout_date: String(data.logout_date).split("T")[0],
//         login_time: String(data.login_time).split(":").slice(0, 2).join(":"),
//         logout_time: String(data.logout_time).split(":").slice(0, 2).join(":"),
//       }));
//       setFilteredData(addSno);
//     } catch (err) {
//       setFilteredData([])
//       console.error("Error while get activity data:", err.stack);
//       Swal.fire("Error", err.response?.data?.message || "Failed to get activity data.", "error");
//     }

//   };

//   // Page Change
//   const handlePageChange = (pageNumber) => {
//     setCurrentPage(pageNumber);
//   };

//   // Handle Login API
//   const handleLoginApi = async () => {
//     try {
//       const userData = JSON.parse(Cookies.get('user'));
//       const now = new Date();
//       const payload = {
//         "emp_id": userData.employee_id || '',
//         "start_time": now.toTimeString().split(' ')[0],
//         "start_date": now.toISOString().split('T')[0]
//       };

//       const response = await addAttendanceLogin(payload);
//       if (response.data.status) {
//         localStorage.setItem("recordID", response.data.data);
//         setCurrentId(response.data.data)
//         setIsRunning(true);
//       }
//       // Swal.fire("Success", response.data.message || "Logged in successfully.", "success");
//     } catch (error) {
//       Swal.fire("Error", error.response?.data?.message || "Failed to start timer.", "error");
//     }
//   };

//   // Handle Logout API
//   const handleLogoutApi = async () => {
//     try {
//       const now = new Date();
//       console.log("initialData", initialData)
//       const payload = {
//         "att_id": curentId || initialData?.attendance_id || '',
//         "logout_date": now.toISOString().split('T')[0],
//         "logout_time": now.toTimeString().split(' ')[0],
//       };
//       const response = await addAttendanceLogout(payload);

//       if (response.data.status) {
//         setIsRunning(false);
//         getTrackerAttendanceData(today.toISOString().split("T")[0])
//       }
//     } catch (error) {
//       Swal.fire("Error", error.response?.data?.message || "Failed to stop timer.", "error");
//     }
//   };

//   // Handle Attendance (Single Button)
//   const handleAttendance = async () => {
//     if (isRunning) {
//       await handleLogoutApi(); // If running → Call logout API
//     } else {
//       await handleLoginApi(); // If not running → Call login API
//     }
//   };

//   // Handle Delete
//   const onDelete = useCallback(async (updatedData, index) => {
//     const result = await Swal.fire({
//       title: "Are you sure about removing this employee?",
//       text: "You won't be able to revert this!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Yes, delete it!",
//       cancelButtonText: "No, cancel!",
//       reverseButtons: true,
//     });

//     if (result.isConfirmed) {
//       try {
//         const payload = { id: updatedData?.employee_id || "" };
//         const response = await deleteEmployee(payload);
//         if (response.data.status) {
//           const newFilteredData = filteredData
//             .filter((item, ind) => ind !== index)
//             .map((item, ind) => ({ ...item, sno: ind + 1 }));

//           setFilteredData(newFilteredData);

//           Swal.fire("Deleted!", response?.data?.message || "Employee deleted successfully.", "success");
//         }
//       } catch (error) {
//         Swal.fire("Error", error.response?.data?.message || "Failed to delete employee.", "error");
//       }
//     }
//   }, [filteredData]);

//   return (
//     <Fragment>
//       <Row>
//         <Col xl={12}>
//           <div className="card shadow-md border-0 rounded-3 py-3 px-3 d-flex flex-row justify-content-between align-items-center">
//             <div className="d-flex align-items-center gap-3">
//               <i className="bi bi-stopwatch-fill display-6 text-primary"></i>
//               <h1 className="display-5 fw-bold text-dark m-0">
//                 {formatTime(time)}
//               </h1>
//               <Button
//                 variant={isRunning ? "danger" : "success"}
//                 className="d-flex align-items-center gap-2 btn btn-sm px-3 py-1"
//                 onClick={handleAttendance}
//               >
//                 <span>{isRunning ? "Logout" : "Login"}</span>
//                 <i className={`bi ${isRunning ? "bi-pause-fill" : "bi-play-fill"} fs-5`}></i>
//               </Button>
//             </div>

//             <div>
//               <Form onSubmit={handleSubmit} className="d-flex gap-3">
//                 <div style={{ position: "relative", display: "inline-block" }}>
//                   <DatePicker
//                     selected={selectedDate}
//                     onChange={handleDateChange}
//                     placeholderText="Select Date"
//                     dateFormat="yyyy/MM/dd"
//                     className="form-control"
//                   />
//                   <FaCalendarAlt
//                     style={{
//                       position: "absolute",
//                       right: "10px",
//                       top: "50%",
//                       transform: "translateY(-50%)",
//                       pointerEvents: "none",
//                       color: "#6c757d",
//                     }}
//                   />
//                 </div>
//                 <Button type="submit" className="btn btn-sm px-4" variant="primary">
//                   Submit
//                 </Button>
//               </Form>
//             </div>


//           </div>
//         </Col>
//       </Row>

//       <Card className="custom-card p-3 mt-4">
//         <Card.Body className="overflow-auto">
//           <Suspense fallback={<Loader />}>
//             <CustomTable
//               columns={[
//                 { header: "Sno", accessor: "sno" },
//                 { header: "Start Time", accessor: "login_time" },
//                 { header: "End Time", accessor: "logout_time" },
//                 { header: "Total Minutes", accessor: "total_minutes" }
//               ]}
//               data={filteredData}
//               currentPage={currentPage}
//               recordsPerPage={recordsPerPage}
//               handlePageChange={handlePageChange}
//               onDelete={onDelete}
//             />
//           </Suspense>
//         </Card.Body>
//       </Card>
//     </Fragment>
//   );
// }


import { useAttendanceContext } from "../../contexts";
import { Row, Col, Card, Button, Form } from "react-bootstrap";
import CustomTable from "../../components/custom/table/CustomTable";
import { useState, Fragment, Suspense, useEffect } from "react";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import Swal from "sweetalert2";
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
    
    if (isRunning) {
      handleLogout();
      getTrackerAttendanceData(selectedDate.toISOString().split('T')[0])
    } else {
      handleLogin();
      getTrackerAttendanceData(selectedDate.toISOString().split('T')[0])
    }
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
