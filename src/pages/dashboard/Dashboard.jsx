
import React, { Fragment, useEffect, useState } from "react";
import { Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import DashboardCard from './DashboardCard'
import { getDashboard } from "../../service/dashboardServices";
import { getLatestTasks } from "../../service/task_management/createTaskServices";
import { getTimesheetLimited } from "../../service/timesheet/employeeTimeSheet";
import { formatDateIntl } from "../../utils/generalUtils";
import demoimage from '../../assets/images/apps/calender.png'


const Dashboard = () => {

  // Redux state selector to get the current year ID

  //Call the custom hook to set the document title to "Dashboard"
  // useDocumentTitle("Dashboard");

  // State to store various metrics fetched from the dashboard API
  const [metrics, setMetrics] = useState({
    employee_count: 0,
    client_count: 0,
    service_count: 0,
    task_pending: 0,
    task_inprogress: 0,
    task_completed: 0,
    today_attendance: 0,
  });

  const [taskDataList, setTaskDataList] = useState([]);
  const [ticketDataList, setTicketataList] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const [res1, res2, res3, res4] = await Promise.all([
          getDashboard(),
          getLatestTasks(),
          getTimesheetLimited()
        ]);
        setMetrics((prev) => ({
          ...prev,
          "client_count": res1.data.data.client_count,
          "employee_count": res1.data.data.employee_count,
          "service_count": res1.data.data.service_count,
          "task_pending": res1.data.data.task_pending,
          "task_inprogress": res1.data.data.task_inprogress,
          "task_completed": res1.data.data.task_completed,
          "today_attendance": res1.data.data.today_attendance
        }))

        setTaskDataList(res2.data.data);
        setTicketataList(res3.data.data);
        console.log("All services fetched:", { res1, res2, res3, res4 });
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);


  return (
    <Fragment>

      <Row>

        <Col className="card-background flex-fill dashboard-card-val">
          <DashboardCard
            Title={'Employee Count'}
            Count={metrics.employee_count}
            Icon={'fe fe-users'}
            Color={'bg-info-transparent text-info'}
          />
        </Col>
        <Col className="card-background flex-fill dashboard-card-val">
          <DashboardCard
            Title={'Client Count'}
            Count={metrics.client_count}
            Icon={'fe fe-user-plus'}
            Color={'bg-teal-transparent text-teal'}
          />
        </Col>
        <Col className="col card-background flex-fill dashboard-card-val">
          <DashboardCard
            Title={'Service Count'}
            Count={metrics.service_count}
            Icon={'fe fe-map'}
            Color={'bg-pink-transparent text-pink'}

          />
        </Col>
        <Col className="col card-background flex-fill dashboard-card-val">
          <DashboardCard
            Title={'Pending Task'}
            Count={metrics.task_pending}
            Icon={'fe fe-mail'}
            Color={'bg-warning-transparent text-warning'}

          />
        </Col>
        <Col className="col card-background flex-fill dashboard-card-val">
          <DashboardCard
            Title={'In Progress Task'}
            Count={metrics.task_inprogress}
            Icon={'bx bx-briefcase'}
            Color={'bg-info-transparent text-info'}

          />
        </Col>
        <Col className="col card-background flex-fill dashboard-card-val">
          <DashboardCard
            Title={'Completed Task'}
            Count={metrics.task_completed}
            Icon={'bx-book-open'}
            Color={'bg-pink-transparent text-pink'}

          />
        </Col>
        <Col className="col card-background flex-fill dashboard-card-val">
          <DashboardCard
            Title={'Today Attendance'}
            Count={metrics.today_attendance}
            Icon={'fe fe-map'}
            Color={'bg-teal-transparent text-teal'}

          />
        </Col>
      </Row>

      <Row>
        <Col xxl={12} xl={12}>
          <Row>
            <Col xxl={6} xl={6} lg={6} className="">
              <Card className="custom-card">
                <Card.Header className="card-header">
                  <Card.Title className="">Recent Tasks</Card.Title>
                </Card.Header>
                <Card.Body>
                  <ul className="task-list mb-0">
                    {
                      taskDataList.map((task, index) => (
                        <li className="" key={index}>
                          <div className="">
                            <i className="task-icon bg-primary"></i>
                            <div className="w-100">

                              <div className="w-100 d-flex justify-content-between">

                                <div style={{ width: '50%' }}>
                                  <h6 className="fw-semibold mb-0">{task.task_name}</h6>
                                  <span className="fs-12 text-muted">{task.description}
                                  </span>
                                </div>

                                <div className="avatar-list-stacked" style={{ width: '25%' }}> {
                                  task.assigned_to?.map((data, index) => (
                                    <OverlayTrigger placement="top" overlay={<Tooltip>{data.emp_name}</Tooltip>}>
                                      <span key={index} className="avatar avatar-sm avatar-rounded"
                                        style={{ width: '30px', height: '30px' }}>
                                        <img src={data.photo || demoimage} alt={data.image || 'img'} />
                                      </span>
                                    </OverlayTrigger>
                                  ))
                                }
                                </div>

                                <div className="min-w-fit-content d-flex ms-2 text-end text-muted gap-1" style={{ width: '25%' }}>
                                  <p className="mb-0 text-muted fs-11m-0">{formatDateIntl(task.due_date)}</p>
                                </div>

                              </div>
                            </div>
                          </div>
                        </li>
                      ))
                    }

                  </ul>
                </Card.Body>
              </Card>
            </Col>


            <Col xxl={6} xl={6} lg={6} className="">
              <Card className="custom-card">
                <Card.Header className="card-header">
                  <Card.Title className="">Recent TimeSheet</Card.Title>
                </Card.Header>
                <Card.Body>
                  <ul className="task-list mb-0">
                    {
                      ticketDataList.map((timesheet, index) => (
                        <li className="" key={index}>

                          <div className="">
                            <i className="task-icon bg-primary"></i>
                            <div className="w-100">

                              <div className="w-100 d-flex justify-content-between">

                                <div style={{ width: '50%' }}>
                                  <h6 className="fw-semibold mb-0">{timesheet.task_name}</h6>
                                  <span className="fs-12 text-muted">{timesheet.task_description}
                                    {/* <Link to="#" className="fw-semibold text-primary"> AngularJS Template</Link> */}
                                  </span>
                                </div>
                                <div className="min-w-fit-content d-flex ms-2 text-end text-muted gap-1 w-50 justify-content-end" style={{ width: '50%' }}>
                                  <p className="mb-0 text-muted fs-11m-0">{timesheet.total_time}</p>
                                </div>

                              </div>
                            </div>
                          </div>
                        </li>
                      ))
                    }

                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Fragment>
  )
}

export default React.memo(Dashboard);