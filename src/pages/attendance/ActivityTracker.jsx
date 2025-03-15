import { useState, useEffect, Fragment, Suspense, useCallback } from "react";
import { Row, Col, Card, Button, Form } from "react-bootstrap";
import Loader from "../../components/common/loader/loader";
import CustomTable from "../../components/custom/table/CustomTable";
export default function ActivityTracker() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const columns = [
    { header: "Sno", accessor: "employee_id", editable: false },
    { header: "Start Time", accessor: "name", editable: false },
    { header: "End Time", accessor: "name", editable: false },
    { header: "Actions", accessor: "Actions", editable: false },
  ];
  const [filteredData, setFilteredData] = useState([]);
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

  // Convert total seconds into HH:MM:SS format
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const onDelete = useCallback(async (updatedData, index) => {

    console.log("update dataaa", updatedData, formData)

    const result = await Swal.fire({
      title: "Are you sure about remove employee?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      try {
        console.log("update dataa", updatedData)
        const payload = { id: updatedData?.employee_id || '' };
        const response = await deleteEmployee(payload);
        if (response.data.status) {
          const newFilteredData = filteredData
            .filter((item, ind) => ind !== index)
            .map((item, ind) => ({ ...item, sno: ind + 1 }));
          setFilteredData(newFilteredData);
          setTableData(newFilteredData);
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
          <div className="d-flex justify-content-center align-items-centermt-5">

            <div className="card shadow-lg border-0 rounded-3 p-3 d-flex flex-row w-100 justify-content-center align-items-center gap-4">
              <div className="d-flex align-items-center justify-content-center gap-3">
                <i className="bi bi-stopwatch-fill display-6 text-primary"></i>
                <h1 className="display-5 fw-bold text-dark m-0">{formatTime(time)}</h1>
              </div>
              <div className="d-flex gap-3">
                {
                  isRunning === true ? (
                    <button
                      className="btn btn-danger d-flex align-items-center gap-2"
                      onClick={() => setIsRunning(false)}
                    >
                      <span>Login</span><i className="bi bi-pause-fill fs-15"></i>
                    </button>
                  ) : (
                    <button
                      className="btn btn-success d-flex align-items-center gap-2"
                      onClick={() => setIsRunning(true)}
                    >
                       <span>Login</span> <i className="bi bi-play-fill fs-15"></i>
                    </button>
                  )
                }

              </div>
            </div>
          </div>
        </Col>
      </Row>

      <Card className="custom-card p-3">
        <Card.Body className="overflow-auto">
          <Suspense fallback={<Loader />}>
            <CustomTable
              columns={columns}
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
