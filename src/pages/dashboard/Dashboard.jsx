
import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Accordion, Card, Col, Dropdown, OverlayTrigger, ProgressBar, Row, Tooltip } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import CustomCard from '../../components/custom/card/Card'
import { Cardsdata, Monthlyprofit, Salesstatistics, Salesvalue } from "./dashboarddata";
import demoimg from '../../assets/images/faces/1.jpg'
import useDocumentTitle from "../../hooks/useDocumentTitle";
import DashboardCard from './DashboardCard'
import { getDashboard } from "../../service/dashboardServices";


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

  // States for managing flash and circular messages
  const [flashmessages, setFlashmessages] = useState([]);

  const [circularmessage, setCircularmessage] = useState([]);

  // Function to fetch dashboard metrics
  const getDashboardService = async () => {
    try {

      const response = await getDashboard();
      if (response.data.status) {
        const metricsData = response.data.data;
        console.log("metricsData", metricsData)
        setMetrics((prev) => ({
          ...prev,
          "client_count": metricsData.client_count,
          "employee_count": metricsData.employee_count,
          "service_count": metricsData.service_count,
          "task_pending": metricsData.task_pending,
          "task_inprogress": metricsData.task_inprogress,
          "task_completed": metricsData.task_completed,
          "today_attendance": metricsData.today_attendance
        }))
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  }

  useEffect(() => {
    getDashboardService()
  }, [])


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
        <Col xxl={3} xl={12}>
          <Row>
            <Col xxl={12} xl={6} lg={6} className="">
              <Card className="custom-card">
                <Card.Header className="card-header">
                  <Card.Title className="">Recent Activity</Card.Title>
                </Card.Header>
                <Card.Body>
                  <ul className="task-list mb-0">
                    <li className="">
                      <div className="">
                        <i className="task-icon bg-primary"></i>
                        <h6 className="fw-semibold mb-0">Task Finished</h6>
                        <div className="flex-grow-1 d-flex align-items-center justify-content-between">
                          <div>
                            <span className="fs-12 text-muted">Adam Berry finished task on
                              <Link to="#" className="fw-semibold text-primary"> AngularJS Template</Link></span>
                          </div>
                          <div className="min-w-fit-content ms-2 text-end">

                            <p className="mb-0 text-muted fs-11m-0">09 July 2021</p>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="">
                      <div className="">
                        <i className="task-icon bg-info"></i>
                        <h6 className="fw-semibold mb-0">Task Overdue</h6>
                        <div className="flex-grow-1 d-flex align-items-center justify-content-between">
                          <div>
                            <span className="fs-12 text-muted">Petey Cruiser finished</span>
                            <Link to="#" className="fw-semibold text-info"> Integrated management</Link>
                          </div>
                          <div className="min-w-fit-content ms-2 text-end">

                            <p className="mb-0 text-muted fs-11m-0">29 June 2021</p>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="">
                      <div className="">
                        <i className="task-icon bg-warning"></i>
                        <h6 className="fw-semibold mb-0">Task Finished</h6>
                        <div className="flex-grow-1 d-flex align-items-center justify-content-between">
                          <div>
                            <span className="fs-12 text-muted">Adam Berry finished task on</span>
                            <Link to="#" className="fw-semibold text-warning"> AngularJS Template</Link>
                          </div>
                          <div className="min-w-fit-content ms-2 text-end">

                            <p className="mb-0 text-muted fs-11m-0">09 July 2021</p>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="">
                      <div className="">
                        <i className="task-icon bg-success"></i>
                        <h6 className="fw-semibold mb-0">Task Finished</h6>
                        <div className="flex-grow-1 d-flex align-items-center justify-content-between">
                          <div>
                            <span className="fs-12 text-muted">Adam Berry finished task on</span>
                            <Link to="#" className="fw-semibold text-success"> AngularJS Template</Link>
                          </div>
                          <div className="min-w-fit-content ms-2 text-end">

                            <p className="mb-0 text-muted fs-11m-0">09 July 2021</p>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li className="mb-0">
                      <div className="">
                        <i className="task-icon bg-secondary"></i>
                        <h6 className="fw-semibold mb-0">New Comment</h6>
                        <div className="flex-grow-1 d-flex align-items-center justify-content-between">
                          <div>
                            <span className="fs-12 text-muted">Adam Berry finished task on</span>
                            <Link to="#" className="fw-semibold text-secondary"> Project Management</Link>
                          </div>
                          <div className="min-w-fit-content ms-2 text-end">

                            <p className="mb-0 text-muted fs-1m-01">25 Aug 2021</p>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
            <div className="col-xxl-12 col-xl-6 col-lg-6">
              <div className="card custom-card overflow-hidden">
                <Card.Header className="card-header justify-content-between">
                  <div className="card-title">
                    Sales by Country
                  </div>
                  <div>
                    <button type="button" className="btn btn-outline-light btn-sm">View All</button>
                  </div>
                </Card.Header>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table text-nowrap mb-0">
                      <thead>
                        <tr>
                          <th scope="row" className="fw-semibold ps-4">Country</th>
                          <th scope="row" className="fw-semibold">Sales</th>
                          <th scope="row" className="fw-semibold">Bounce</th>
                        </tr>
                      </thead>
                      <tbody className="top-selling">
                        <tr>
                          <td className=" ps-4">
                            <div className="d-flex align-items-center">
                              <span className="avatar avatar-md p-2 bg-light avatar-rounded">
                                <img src={demoimg} className="rounded-circle" alt="" />
                              </span>
                              <div className="ms-2">
                                <p className="mb-0 fw-semibold">Canada</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="fw-semibold">2500</span>
                          </td>
                          <td><span className="badge badge-sm bg-success-transparent text-success">24.4%</span></td>
                        </tr>
                        <tr>
                          <td className=" ps-4">
                            <div className="d-flex align-items-center">
                              <span className="avatar avatar-md p-2 bg-light avatar-rounded">
                                <img src={demoimg} className="rounded-circle" alt="" />
                              </span>
                              <div className="ms-2">
                                <p className="mb-0 fw-semibold">Germany</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="fw-semibold">846</span>
                          </td>
                          <td><span className="badge badge-sm bg-danger-transparent text-danger">22.33%</span></td>
                        </tr>
                        <tr>
                          <td className=" ps-4">
                            <div className="d-flex align-items-center">
                              <span className="avatar avatar-md p-2 bg-light avatar-rounded">
                                <img src={demoimg} className="rounded-circle" alt="" />
                              </span>
                              <div className="ms-2">
                                <p className="mb-0 fw-semibold">Mexico</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="fw-semibold">1,024</span>
                          </td>
                          <td><span className="badge badge-sm bg-danger-transparent text-danger">14.8%</span></td>
                        </tr>
                        <tr>
                          <td className=" ps-4">
                            <div className="d-flex align-items-center">
                              <span className="avatar avatar-md p-2 bg-light avatar-rounded">
                                <img src={demoimg} className="rounded-circle" alt="" />
                              </span>
                              <div className="ms-2">
                                <p className="mb-0 fw-semibold">Russia</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="fw-semibold">482</span>
                          </td>
                          <td><span className="badge badge-sm bg-success-transparent text-success">05.8%</span></td>
                        </tr>
                        <tr>
                          <td className=" ps-4 border-bottom-0">
                            <div className="d-flex align-items-center">
                              <span className="avatar avatar-md p-2 bg-light avatar-rounded">
                                <img src={demoimg} className="rounded-circle" alt="" />
                              </span>
                              <div className="ms-2">
                                <p className="mb-0 fw-semibold">USA</p>
                              </div>
                            </div>
                          </td>
                          <td className="border-bottom-0">
                            <span className="fw-semibold">1,410</span>
                          </td>
                          <td className="border-bottom-0"><span className="badge badge-sm bg-danger-transparent text-danger">13.08%</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </Row>
        </Col>
        <Col xxl={6} xl={12}>
          <Row>
            <Col xxl={12} xl={12}>
              <Card className="card custom-card overflow-hidden">
                <Card.Header className="card-header  justify-content-between ">
                  <Card.Title className="card-title">Sales Statistics</Card.Title>
                  <Dropdown className="dropdown d-flex">
                    <Link to="#" className="btn btn-sm btn-primary-light btn-wave waves-effect waves-light d-flex align-items-center me-2">
                      <i className="ri-filter-3-line me-1"></i>Filter</Link>
                    <Dropdown.Toggle variant='' className="btn dropdown-toggle btn-sm btn-wave waves-effect waves-light btn-primary d-flex align-items-center"
                      id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false"><i className="ri-calendar-2-line me-1"></i>This Week</Dropdown.Toggle>
                    <Dropdown.Menu as="ul" className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                      <Dropdown.Item href="#">Last Month</Dropdown.Item>
                      <Dropdown.Item href="#">Last Week</Dropdown.Item>
                      <Dropdown.Item href="#">Share Report</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Card.Header>
                <Card.Body>
                  <div id="earnings">
                    <Salesstatistics />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col xxl={12} xl={12}>
              <div className="card custom-card overflow-hidden">
                <Card.Header className="card-header justify-content-between">
                  <div className="card-title">
                    Top Selling Products
                  </div>
                  <Dropdown>
                    <Dropdown.Toggle variant='' aria-label="anchor" className="btn btn-outline-light btn-icons btn-sm text-muted my-1 no-caret" data-bs-toggle="dropdown">
                      <i className="fe fe-more-vertical"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu as="ul" className="dropdown-menu mb-0">
                      <Dropdown.Item className="border-bottom" href="#">Action</Dropdown.Item>
                      <Dropdown.Item className="border-bottom" href="#">Another action</Dropdown.Item>
                      <Dropdown.Item href="#">Something else here</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Card.Header>
                <Row>
                  <Col xl={12}>
                    <div className="card-body p-0">
                      <div className="table-responsive">
                        <table className="table text-nowrap table-hover rounded-3 overflow-hidden">
                          <thead>
                            <tr>
                              <th scope="row" className="ps-4">Product Name</th>
                              <th scope="row">stock</th>
                              <th scope="row">Price</th>
                              <th scope="row">Sold</th>
                              <th scope="row">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td className=" ps-4">
                                <div className="d-flex align-items-center">
                                  <div className="avatar avatar-sm me-2">
                                    <img src={demoimg} alt="avatar" className="rounded-1" />
                                  </div>
                                  <Link to={`${import.meta.env.BASE_URL}pages/ecommerce/productdetails`}>Sports Shoes For Men</Link>
                                </div>
                              </td>
                              <td>
                                <div className="mt-sm-1 d-block">
                                  <span
                                    className="badge bg-success-transparent text-success">In Stock</span>
                                </div>
                              </td>
                              <td> $73.800</td>
                              <td>1,534</td>
                              <td>
                                <div className="g-2">
                                  <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                                    <Link to="#" aria-label="anchor" className="btn  btn-primary-light btn-sm" data-bs-toggle="tooltip" data-bs-original-title="Edit">
                                      <span className="ri-pencil-line fs-14"></span>
                                    </Link>
                                  </OverlayTrigger>
                                  <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                                    <Link to="#" aria-label="anchor" className="btn btn-danger-light btn-sm ms-2" data-bs-toggle="tooltip" data-bs-original-title="Delete">
                                      <span className="ri-delete-bin-7-line fs-14"></span>
                                    </Link>
                                  </OverlayTrigger>

                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td className=" ps-4">
                                <div className="d-flex align-items-center">
                                  <div className="avatar avatar-sm me-2">
                                    <img src={demoimg} alt="avatar" className="rounded-1" />
                                  </div>
                                  <Link to={`${import.meta.env.BASE_URL}pages/ecommerce/productdetails`}>Beautiful flower Frame</Link>
                                </div>
                              </td>
                              <td>
                                <div className="mt-sm-1 d-block">
                                  <span
                                    className="badge bg-info-transparent text-info">Few-left</span>
                                </div>
                              </td>
                              <td> $73.800</td>
                              <td>4,987</td>
                              <td>
                                <div className="g-2">
                                  <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                                    <Link to="#" aria-label="anchor" className="btn  btn-primary-light btn-sm" data-bs-toggle="tooltip" data-bs-original-title="Edit">
                                      <span className="ri-pencil-line fs-14"></span>
                                    </Link>
                                  </OverlayTrigger>
                                  <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                                    <Link to="#" aria-label="anchor" className="btn btn-danger-light btn-sm ms-2" data-bs-toggle="tooltip" data-bs-original-title="Delete">
                                      <span className="ri-delete-bin-7-line fs-14"></span>
                                    </Link>
                                  </OverlayTrigger>

                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td className=" ps-4">
                                <div className="d-flex align-items-center">
                                  <div className="avatar avatar-sm me-2">
                                    <img src={demoimg} alt="avatar" className="rounded-1" />
                                  </div>
                                  <Link to={`${import.meta.env.BASE_URL}pages/ecommerce/productdetails`}>Small alarm Watch</Link>
                                </div>
                              </td>
                              <td>
                                <div className="mt-sm-1 d-block">
                                  <span
                                    className="badge bg-danger-transparent text-danger">Out Of Stock</span>
                                </div>
                              </td>
                              <td> $13.800</td>
                              <td>87,875</td>
                              <td>
                                <div className="g-2">
                                  <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                                    <Link to="#" aria-label="anchor" className="btn  btn-primary-light btn-sm" data-bs-toggle="tooltip" data-bs-original-title="Edit">
                                      <span className="ri-pencil-line fs-14"></span>
                                    </Link>
                                  </OverlayTrigger>
                                  <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                                    <Link to="#" aria-label="anchor" className="btn btn-danger-light btn-sm ms-2" data-bs-toggle="tooltip" data-bs-original-title="Delete">
                                      <span className="ri-delete-bin-7-line fs-14"></span>
                                    </Link>
                                  </OverlayTrigger>

                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td className=" ps-4">
                                <div className="d-flex align-items-center">
                                  <div className="avatar avatar-sm me-2">
                                    <img src={demoimg} alt="avatar" className="rounded-1" />
                                  </div>
                                  <Link to={`${import.meta.env.BASE_URL}pages/ecommerce/productdetails`}>Black colord lens cemara</Link>
                                </div>
                              </td>
                              <td>
                                <div className="mt-sm-1 d-block">
                                  <span
                                    className="badge bg-success-transparent text-success">In Stock</span>
                                </div>
                              </td>
                              <td> $14.600</td>
                              <td>98,876</td>
                              <td>
                                <div className="g-2">
                                  <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                                    <Link to="#" aria-label="anchor" className="btn  btn-primary-light btn-sm" data-bs-toggle="tooltip" data-bs-original-title="Edit">
                                      <span className="ri-pencil-line fs-14"></span>
                                    </Link>
                                  </OverlayTrigger>
                                  <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                                    <Link to="#" aria-label="anchor" className="btn btn-danger-light btn-sm ms-2" data-bs-toggle="tooltip" data-bs-original-title="Delete">
                                      <span className="ri-delete-bin-7-line fs-14"></span>
                                    </Link>
                                  </OverlayTrigger>

                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td className=" ps-4">
                                <div className="d-flex align-items-center">
                                  <div className="avatar avatar-sm me-2">
                                    <img src={demoimg} alt="avatar" className="rounded-1" />
                                  </div>
                                  <Link to={`${import.meta.env.BASE_URL}pages/ecommerce/productdetails`}>Smart Phone</Link>
                                </div>
                              </td>
                              <td>
                                <div className="mt-sm-1 d-block">
                                  <span
                                    className="badge bg-danger-transparent text-danger">Out Of Stock</span>
                                </div>
                              </td>
                              <td> $13.800</td>
                              <td>87,875</td>
                              <td>
                                <div className="g-2">
                                  <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                                    <Link to="#" aria-label="anchor" className="btn  btn-primary-light btn-sm" data-bs-toggle="tooltip" data-bs-original-title="Edit">
                                      <span className="ri-pencil-line fs-14"></span>
                                    </Link>
                                  </OverlayTrigger>
                                  <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                                    <Link to="#" aria-label="anchor" className="btn btn-danger-light btn-sm ms-2" data-bs-toggle="tooltip" data-bs-original-title="Delete">
                                      <span className="ri-delete-bin-7-line fs-14"></span>
                                    </Link>
                                  </OverlayTrigger>

                                </div>
                              </td>
                            </tr>
                            <tr>
                              <td className=" ps-4">
                                <div className="d-flex align-items-center">
                                  <div className="avatar avatar-sm me-2">
                                    <img src={demoimg} alt="avatar" className="rounded-1" />
                                  </div>
                                  <Link to={`${import.meta.env.BASE_URL}pages/ecommerce/productdetails`}> Black colored Headset</Link>
                                </div>
                              </td>
                              <td>
                                <div className="mt-sm-1 d-block">
                                  <span
                                    className="badge bg-info-transparent text-info">Few-left</span>
                                </div>
                              </td>
                              <td> $23.800</td>
                              <td>1,987</td>
                              <td>
                                <div className="g-2">
                                  <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                                    <Link to="#" aria-label="anchor" className="btn  btn-primary-light btn-sm" data-bs-toggle="tooltip" data-bs-original-title="Edit">
                                      <span className="ri-pencil-line fs-14"></span>
                                    </Link>
                                  </OverlayTrigger>
                                  <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                                    <Link to="#" aria-label="anchor" className="btn btn-danger-light btn-sm ms-2" data-bs-toggle="tooltip" data-bs-original-title="Delete">
                                      <span className="ri-delete-bin-7-line fs-14"></span>
                                    </Link>
                                  </OverlayTrigger>

                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </Col>
        <Col xxl={3} xl={12}>
          <Row>
            <div className="col-xxl-12 col-xl-6">
              <div className="card custom-card">
                <Card.Header className="card-header justify-content-between">
                  <div className="card-title">
                    Sales Value
                  </div>
                  <Dropdown>
                    <Dropdown.Toggle variant='' className="btn-outline-light btn btn-sm text-muted no-caret" data-bs-toggle="dropdown" aria-expanded="false">
                      View All<i className="ri-arrow-down-s-line align-middle ms-1"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu as="ul" className="dropdown-menu mb-0" role="menu" align="end">
                      <Dropdown.Item className="border-bottom" href="#">Today</Dropdown.Item>
                      <Dropdown.Item className="border-bottom" href="#">This Week</Dropdown.Item>
                      <Dropdown.Item className="dropdown-item" href="#">Last Week</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Card.Header>
                <div className="card-body p-0">
                  <div className="">
                    <div className=" border-bottom">
                      <div id="avgsales">
                        <Salesvalue />
                      </div>
                    </div>
                    <div className="d-flex justify-content-center">
                      <div className="d-flex p-4 border-end">
                        <div className="text-center">
                          <p className="mb-1 text-muted"> <i className="bx bxs-circle text-primary fs-13  me-1"></i>Sale Items</p>
                          <h5 className="mb-0">186,75.00 </h5>
                        </div>
                      </div>

                      <div className="d-flex p-4">
                        <div className="text-center">
                          <p className="mb-1 text-muted"> <i className="bx bxs-circle text-primary text-opacity-25 fs-13  me-1"></i>Sale Revenue</p>
                          <h5 className=" mb-0">$122,39 </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xxl-12 col-xl-6">
              <div className="card custom-card">
                <Card.Header className="card-header justify-content-between">
                  <div className="card-title">
                    Monthly Profits
                  </div>
                  <Dropdown>
                    <Dropdown.Toggle variant='' className="btn-outline-light btn btn-sm text-muted no-caret" data-bs-toggle="dropdown" aria-expanded="false">
                      View All<i className="ri-arrow-down-s-line align-middle ms-1"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu as="ul" className="dropdown-menu mb-0" role="menu" align="end">
                      <Dropdown.Item className="border-bottom" href="#">Today</Dropdown.Item>
                      <Dropdown.Item className="border-bottom" href="#">This Week</Dropdown.Item>
                      <Dropdown.Item href="#">Last Week</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Card.Header>
                <div className="card-body p-0">
                  <div className="d-flex flex-wrap px-3 py-4 border-bottom">
                    <div>
                      <h4 className="mb-1 text-xl">$78,344</h4>
                      <p className="text-muted mb-0">Total Profit Growth Of 85%</p>
                    </div>
                    <div className="ms-sm-auto">
                      <div className="mt-2">
                        <span id="sparkline8">
                          <Monthlyprofit />
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 ">
                    <ul className="mb-0 mt-1 monthly-profit">
                      <li>
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            <span className="avatar avatar-md br-5 bg-warning-transparent text-warning"><i className="fe fe-box"></i></span>
                          </div>
                          <div className="flex-fill dashboard-card-val">
                            <div className="d-flex justify-content-between">
                              <h6 className="fw-semibold">
                                Fashion
                              </h6>
                              <div>
                                <p className="mb-0 fs-13 text-muted">
                                  <i className="fe fe-arrow-up-right me-1 text-success brround"></i>93.0%
                                </p>
                              </div>
                            </div>
                            <ProgressBar variant='warning' animated striped className='progress-xs  progress-bar-animated' now={93} />
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            <span className="avatar avatar-md br-5 bg-primary-transparent text-primary"><i className="fe fe-home"></i></span>
                          </div>
                          <div className="flex-fill dashboard-card-val">
                            <div className="d-flex justify-content-between">
                              <h6 className="fw-semibold">
                                Home Furniture
                              </h6>
                              <div>
                                <p className="mb-0 fs-13 text-muted">
                                  <i className="fe fe-arrow-up-right me-1 text-success brround"></i>97.0%
                                </p>
                              </div>
                            </div>

                            <ProgressBar variant='primary' animated striped className='progress-xs  progress-bar-animated' now={97} />
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            <span className="avatar avatar-md br-5 bg-secondary-transparent text-secondary"><i className="fe fe-tv"></i></span>
                          </div>
                          <div className="flex-fill dashboard-card-val">
                            <div className="d-flex justify-content-between">
                              <h6 className="fw-semibold">
                                Electronics
                              </h6>
                              <div>
                                <p className="mb-0 fs-13 text-muted">
                                  <i className="fe fe-arrow-up-right me-1 text-success brround"></i>80.0%
                                </p>
                              </div>
                            </div>
                            <ProgressBar variant='secondary' animated striped className='progress-xs  progress-bar-animated' now={80} />
                          </div>
                        </div>
                      </li>
                      <li>
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            <span className="avatar avatar-md br-5 bg-info-transparent text-info"><i className="fe fe-zap"></i></span>
                          </div>
                          <div className="flex-fill dashboard-card-val">
                            <div className="d-flex justify-content-between">
                              <h6 className="fw-semibold">
                                Groceries
                              </h6>
                              <div>
                                <p className="mb-0 fs-13 text-muted">
                                  <i className="fe fe-arrow-up-right me-1 text-success brround"></i>80.0%
                                </p>
                              </div>
                            </div>
                            <ProgressBar variant='info' animated striped className='progress-xs  progress-bar-animated' now={80} />
                          </div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </Row>
        </Col>
      </Row>

      <Row>
        <Col xxl={3} xl={5} className="">
          <Card className="custom-card">
            <Card.Header className="justify-content-between">
              <Card.Title className="">
                TransActions History
              </Card.Title>
              <Dropdown>
                <Dropdown.Toggle variant='' className="btn-outline-light btn btn-sm text-muted no-caret" data-bs-toggle="dropdown" aria-expanded="false">
                  View All<i className="ri-arrow-down-s-line align-middle ms-1"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu" role="menu">
                  <Dropdown.Item className="border-bottom" href="#">Today</Dropdown.Item>
                  <Dropdown.Item className="border-bottom" href="#">This Week</Dropdown.Item>
                  <Dropdown.Item href="#">Last Week</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Card.Header>
            <Card.Body>
              <ul className="mb-0 sales-transaction-history-list">
                <li>
                  <div className="d-flex">
                    <a aria-label="anchor" href="#"><span className="avatar avatar-md rounded-circle br-5 bg-success-transparent text-success border-success border-opacity-25 border me-3"><i className="fe fe-credit-card"></i></span></a>
                    <div className="w-100">
                      <Link to="#">
                        <span className="mb-1 fs-14 fw-semibold text-default me-3">ATM Withdrawl</span>
                      </Link>
                      <p className="fs-12 text-muted me-3 mb-0">Just now</p>
                    </div>
                    <div className=" my-auto">
                      <h6 className="mb-0 text-success">
                        $2,45,000
                      </h6>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="d-flex">
                    <Link aria-label="anchor" to="#"><span className="avatar avatar-md rounded-circle br-5 bg-danger-transparent text-danger border-danger border-opacity-25 me-3 border"><i className="fe fe-smartphone"></i></span></Link>
                    <div className="w-100">
                      <Link to="#">
                        <span className="mb-1 fs-14 fw-semibold text-default me-3">Movies Subscription</span>
                      </Link>
                      <p className="fs-12 text-muted me-3 mb-0">Yesterday</p>
                    </div>
                    <div className=" my-auto">
                      <h6 className="mb-0 text-danger">
                        -$100.00
                      </h6>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="d-flex">
                    <Link aria-label="anchor" to="#"><span className="avatar avatar-md rounded-circle br-5 bg-success-transparent text-success border-success border-opacity-25 border me-3"><i className="fe fe-arrow-down"></i></span></Link>
                    <div className="w-100">
                      <Link to="#">
                        <span className="mb-1 fs-14 fw-semibold text-default me-3">Recieved from John</span>
                      </Link>
                      <p className="fs-12 text-muted me-3 mb-0">17-04-2022</p>
                    </div>
                    <div className=" my-auto">
                      <h6 className="mb-0 text-success">
                        $1,50,000
                      </h6>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="d-flex">
                    <Link aria-label="anchor" to="#"><span className="avatar avatar-md rounded-circle br-5 bg-danger-transparent text-danger border-danger border-opacity-25 me-3 border"><i className="fe fe-credit-card"></i></span></Link>
                    <div className="w-100">
                      <Link to="#">
                        <span className="mb-1 fs-14 fw-semibold text-default me-3">Credit Card</span>
                      </Link>
                      <p className="fs-12 text-muted me-3 mb-0">25-04-2022</p>
                    </div>
                    <div className=" my-auto">
                      <h6 className="mb-0 text-danger">
                        -$3,000
                      </h6>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="d-flex">
                    <Link aria-label="anchor" to="#"><span className="avatar avatar-md rounded-circle br-5 bg-success-transparent text-success border-success border-opacity-25 border me-3"><i className="fe fe-repeat"></i></span></Link>
                    <div className="w-100">
                      <Link to="#">
                        <span className="mb-1 fs-14 fw-semibold text-default me-3">Transfer to XYZ Card</span>
                      </Link>
                      <p className="fs-12 text-muted me-3 mb-0">30-04-2022</p>
                    </div>
                    <div className=" my-auto">
                      <h6 className="mb-0 text-success">
                        $15,000
                      </h6>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="d-flex">
                    <Link aria-label="anchor" to="#"><span className="avatar avatar-md rounded-circle br-5 bg-danger-transparent text-danger border-danger border-opacity-25 me-3 border"><i className="fe fe-repeat"></i></span></Link>
                    <div className="w-100">
                      <Link to="#">
                        <span className="mb-1 fs-14 fw-semibold text-default me-3">Transfer to XYZ Card</span>
                      </Link>
                      <p className="fs-12 text-muted me-3 mb-0">30-04-2022</p>
                    </div>
                    <div className=" my-auto">
                      <h6 className="mb-0 text-success">
                        $15,000
                      </h6>
                    </div>
                  </div>
                </li>
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col xxl={9} xl={7} className="">
          <Card className="custom-card">
            <Card.Header className="card-header">
              <div>
                <h5 className="card-title mb-0">Recent Orders</h5>
              </div>
              <Dropdown className="ms-auto">
                <Dropdown.Toggle variant='' aria-label="anchor" className="btn btn-outline-light btn-icons btn-sm text-muted no-caret" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                  <i className="fe fe-more-vertical"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                  <Dropdown.Item className="d-flex dropdown-item" href="#">
                    <i className="ri-share-forward-line me-2"></i>Share
                  </Dropdown.Item>
                  <Dropdown.Item className="d-flex dropdown-item" href="#">
                    <i className="ri-download-2-line me-2"></i>Download
                  </Dropdown.Item>
                  <Dropdown.Item className="d-flex dropdown-item" href="#">
                    <i className="ri-delete-bin-7-line me-2"></i>Delete
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <table className="table text-nowrap table-hover border table-bordered">
                  <thead className="border-top">
                    <tr>
                      <th scope="row" className="border-bottom-0 text-center">S.NO</th>
                      <th scope="row" className="border-bottom-0">Customer Name</th>
                      <th scope="row" className="border-bottom-0">Order ID</th>
                      <th scope="row" className="border-bottom-0">Order Date</th>
                      <th scope="row" className="border-bottom-0">Price</th>
                      <th scope="row" className="border-bottom-0">Status</th>
                      <th scope="row" className="border-bottom-0">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-bottom">
                      <td className="text-center">01</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar avatar-md me-2 avatar-rounded lh-1">
                            <img src={demoimg} alt="avatar" />
                          </div>
                          <div className="lh-1">
                            <Link to={`${import.meta.env.BASE_URL}pages/ecommerce/productdetails`}>Patty Furniture</Link>
                            <p className="text-muted fs-11 mb-0 mt-1">patty@spruko.com</p>
                          </div>
                        </div>
                      </td>
                      <td><span className="text-decoration-underline text-primary">#123SP90</span></td>
                      <td>01 Apr 2022</td>
                      <td> $73.800</td>
                      <td>
                        <div className="mt-sm-1 d-block">
                          <span
                            className="badge bg-success-transparent text-success">Delivered</span>
                        </div>
                      </td>
                      <td>
                        <div className="g-2">
                          <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                            <a aria-label="anchor" className="btn  btn-primary-light btn-sm">
                              <span className="ri-pencil-line fs-14"></span>
                            </a>
                          </OverlayTrigger>
                          <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                            <a aria-label="anchor" className="btn btn-danger-light btn-sm ms-2">
                              <span className="ri-delete-bin-7-line fs-14"></span>
                            </a>
                          </OverlayTrigger>
                        </div>

                      </td>
                    </tr>
                    <tr className="border-bottom">
                      <td className="text-center">02</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar avatar-md me-2 avatar-rounded lh-1">
                            <img src={demoimg} alt="avatar" />
                          </div>
                          <div className="lh-1">
                            <Link to={`${import.meta.env.BASE_URL}pages/ecommerce/productdetails`}>Allie Grate</Link>
                            <p className="fs-11 text-muted mb-0 mt-1">allie@spruko.com</p>
                          </div>
                        </div>
                      </td>
                      <td><span className="text-decoration-underline text-primary">#123SP91</span></td>
                      <td>02 Apr 2022</td>
                      <td> $73.800</td>
                      <td>
                        <div className="mt-sm-1 d-block">
                          <span
                            className="badge bg-success-transparent text-success">Delivered</span>
                        </div>
                      </td>
                      <td>
                        <div className="g-2">
                          <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                            <a aria-label="anchor" className="btn  btn-primary-light btn-sm">
                              <span className="ri-pencil-line fs-14"></span>
                            </a>
                          </OverlayTrigger>
                          <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                            <a aria-label="anchor" className="btn btn-danger-light btn-sm ms-2">
                              <span className="ri-delete-bin-7-line fs-14"></span>
                            </a>
                          </OverlayTrigger>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-bottom">
                      <td className="text-center">03</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar avatar-md me-2 avatar-rounded lh-1">
                            <img src={demoimg} alt="avatar" />
                          </div>
                          <div className="lh-1">
                            <Link to={`${import.meta.env.BASE_URL}pages/ecommerce/productdetails`}>Peg Legge</Link>
                            <p className="fs-11 text-muted mb-0 mt-1">peg@spruko.com</p>
                          </div>
                        </div>
                      </td>
                      <td><span className="text-decoration-underline text-primary">#123SP92</span></td>
                      <td>24 Mar 2022</td>
                      <td> $13.800</td>
                      <td>
                        <div className="mt-sm-1 d-block">
                          <span
                            className="badge bg-danger-transparent text-danger">Cancelled</span>
                        </div>
                      </td>
                      <td>
                        <div className="g-2">
                          <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                            <a aria-label="anchor" className="btn  btn-primary-light btn-sm">
                              <span className="ri-pencil-line fs-14"></span>
                            </a>
                          </OverlayTrigger>
                          <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                            <a aria-label="anchor" className="btn btn-danger-light btn-sm ms-2">
                              <span className="ri-delete-bin-7-line fs-14"></span>
                            </a>
                          </OverlayTrigger>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-bottom">
                      <td className="text-center">04</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar avatar-md me-2 avatar-rounded lh-1">
                            <img src={demoimg} alt="avatar" />
                          </div>
                          <div className="lh-1">
                            <Link to={`${import.meta.env.BASE_URL}pages/ecommerce/productdetails`}>Maureen Biologist</Link>
                            <p className="fs-11 text-muted mb-0 mt-1">maureen@spruko.com</p>
                          </div>
                        </div>
                      </td>
                      <td><span className="text-decoration-underline text-primary">#123SP93</span></td>
                      <td>22 Mar 2022</td>
                      <td> $14.600</td>
                      <td>
                        <div className="mt-sm-1 d-block">
                          <span
                            className="badge bg-info-transparent text-info">Pending</span>
                        </div>
                      </td>
                      <td>
                        <div className="g-2">
                          <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                            <a aria-label="anchor" className="btn  btn-primary-light btn-sm">
                              <span className="ri-pencil-line fs-14"></span>
                            </a>
                          </OverlayTrigger>
                          <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                            <a aria-label="anchor" className="btn btn-danger-light btn-sm ms-2">
                              <span className="ri-delete-bin-7-line fs-14"></span>
                            </a>
                          </OverlayTrigger>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-bottom">
                      <td className="text-center">05</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar avatar-md me-2 avatar-rounded lh-1">
                            <img src={demoimg} alt="avatar" />
                          </div>
                          <div className="lh-1">
                            <Link to={`${import.meta.env.BASE_URL}pages/ecommerce/productdetails`}>Olive Yew</Link>
                            <p className="text-muted mb-0 mt-1 fs-11">olive@spruko.com</p>
                          </div>
                        </div>
                      </td>
                      <td><span className="text-decoration-underline text-primary">#123SP94</span></td>
                      <td>20 Mar 2022</td>
                      <td> $74.965</td>
                      <td>
                        <div className="mt-sm-1 d-block">
                          <span
                            className="badge bg-warning-transparent text-warning">Shipped</span>
                        </div>
                      </td>
                      <td>
                        <div className="g-2">
                          <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                            <a aria-label="anchor" className="btn  btn-primary-light btn-sm">
                              <span className="ri-pencil-line fs-14"></span>
                            </a>
                          </OverlayTrigger>
                          <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                            <a aria-label="anchor" className="btn btn-danger-light btn-sm ms-2">
                              <span className="ri-delete-bin-7-line fs-14"></span>
                            </a>
                          </OverlayTrigger>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="dashboard-accordian">
        <Col xxl={6} xl={6} md={5}>
          <Card className="custom-card overflow-hidden">
            <Card.Header className="justify-content-between px-4 pt-3 pb-2">
              <h6 className="card-title dashboard-accordian-title">Flash Messages</h6>
            </Card.Header>
            <Card.Body style={{ padding: '2% 4%', height: '280px', overflow: 'scroll' }}>
              <Accordion defaultActiveKey="0" className="accordion accordionicon-left accordions-items-seperate">
                <Accordion.Item eventKey="0">
                  <Accordion.Header className="dashboard-accordian-header">
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="">FIRST TERMINAL EXAM TIME TABLE</h6>
                      <p className="m-0">09 July 2021</p>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body style={{ padding: '2% 4%' }}>
                    <Row>
                      <Col xl={12}>
                        <Row>
                          <Card className="custom-card m-0 dashboard-card-accordian" style={{ boxShadow: 'none' }}>
                            <Card.Body className="p-1 dashboard-card-boday-accordian">
                              kindly note the timings for the exam: From 19/09/22 Monday to 23/09/22 Friday will be regular full working day. From 26/09/22
                              Monday to 30/09/22 Friday will be 10.30 am to 1.00 pm.
                            </Card.Body>
                          </Card>
                        </Row>
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header className="dashboard-accordian-header">
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="">FIRST TERMINAL EXAM TIME TABLE</h6>
                      <p className="m-0">09 July 2021</p>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body style={{ padding: '2% 4%' }}>
                    <Row>
                      <Col xl={12}>
                        <Row>
                          <Card className="custom-card m-0 dashboard-card-accordian" style={{ boxShadow: 'none' }}>
                            <Card.Body className="p-1 dashboard-card-boday-accordian">
                              kindly note the timings for the exam: From 19/09/22 Monday to 23/09/22 Friday will be regular full working day. From 26/09/22
                              Monday to 30/09/22 Friday will be 10.30 am to 1.00 pm.
                            </Card.Body>
                          </Card>
                        </Row>
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header className="dashboard-accordian-header">
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="">FIRST TERMINAL EXAM TIME TABLE</h6>
                      <p className="m-0">09 July 2021</p>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body style={{ padding: '2% 4%' }}>
                    <Row>
                      <Col xl={12}>
                        <Row>
                          <Card className="custom-card m-0 dashboard-card-accordian" style={{ boxShadow: 'none' }}>
                            <Card.Body className="p-1 dashboard-card-boday-accordian">
                              kindly note the timings for the exam: From 19/09/22 Monday to 23/09/22 Friday will be regular full working day. From 26/09/22
                              Monday to 30/09/22 Friday will be 10.30 am to 1.00 pm.
                            </Card.Body>
                          </Card>
                        </Row>
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                  <Accordion.Header className="dashboard-accordian-header">
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="">FIRST TERMINAL EXAM TIME TABLE</h6>
                      <p className="m-0">09 July 2021</p>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body style={{ padding: '2% 4%' }}>
                    <Row>
                      <Col xl={12}>
                        <Row>
                          <Card className="custom-card m-0 dashboard-card-accordian" style={{ boxShadow: 'none' }}>
                            <Card.Body className="p-1 dashboard-card-boday-accordian">
                              kindly note the timings for the exam: From 19/09/22 Monday to 23/09/22 Friday will be regular full working day. From 26/09/22
                              Monday to 30/09/22 Friday will be 10.30 am to 1.00 pm.
                            </Card.Body>
                          </Card>
                        </Row>
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card.Body>
          </Card>
        </Col>

        <Col xxl={6} xl={6} md={5}>
          <Card className="custom-card overflow-hidden">
            <Card.Header className="justify-content-between px-4 pt-3 pb-2">
              <h6 className="card-title dashboard-accordian-title">Circular Messages</h6>
            </Card.Header>
            <Card.Body style={{ padding: '2% 4%', height: '280px', overflow: 'scroll' }}>
              <Accordion defaultActiveKey="0" className="accordion accordionicon-left accordions-items-seperate">
                <Accordion.Item eventKey="0">
                  <Accordion.Header className="dashboard-accordian-header">
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="fw-200">FIRST TERMINAL EXAM TIME TABLE</h6>
                      <p className="m-0">09 July 2021</p>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body style={{ padding: '2% 4%' }}>
                    <Row>
                      <Col xl={12}>
                        <Row>
                          <Card className="custom-card m-0 dashboard-card-accordian" style={{ boxShadow: 'none' }}>
                            <Card.Body className="p-1 dashboard-card-boday-accordian">
                              kindly note the timings for the exam: From 19/09/22 Monday to 23/09/22 Friday will be regular full working day. From 26/09/22
                              Monday to 30/09/22 Friday will be 10.30 am to 1.00 pm.
                            </Card.Body>
                          </Card>
                        </Row>
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header className="dashboard-accordian-header">
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="">FIRST TERMINAL EXAM TIME TABLE</h6>
                      <p className="m-0">09 July 2021</p>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body style={{ padding: '2% 4%' }}>
                    <Row>
                      <Col xl={12}>
                        <Row>
                          <Card className="custom-card m-0 dashboard-card-accordian" style={{ boxShadow: 'none' }}>
                            <Card.Body className="p-1 dashboard-card-boday-accordian">
                              kindly note the timings for the exam: From 19/09/22 Monday to 23/09/22 Friday will be regular full working day. From 26/09/22
                              Monday to 30/09/22 Friday will be 10.30 am to 1.00 pm.
                            </Card.Body>
                          </Card>
                        </Row>
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                  <Accordion.Header className="dashboard-accordian-header">
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="">FIRST TERMINAL EXAM TIME TABLE</h6>
                      <p className="m-0">09 July 2021</p>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body style={{ padding: '2% 4%' }}>
                    <Row>
                      <Col xl={12}>
                        <Row>
                          <Card className="custom-card m-0 dashboard-card-accordian" style={{ boxShadow: 'none' }}>
                            <Card.Body className="p-1 dashboard-card-boday-accordian">
                              kindly note the timings for the exam: From 19/09/22 Monday to 23/09/22 Friday will be regular full working day. From 26/09/22
                              Monday to 30/09/22 Friday will be 10.30 am to 1.00 pm.
                            </Card.Body>
                          </Card>
                        </Row>
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="3">
                  <Accordion.Header className="dashboard-accordian-header">
                    <div className="d-flex w-100 justify-content-between">
                      <h6 className="">FIRST TERMINAL EXAM TIME TABLE</h6>
                      <p className="m-0">09 July 2021</p>
                    </div>
                  </Accordion.Header>
                  <Accordion.Body style={{ padding: '2% 4%' }}>
                    <Row>
                      <Col xl={12}>
                        <Row>
                          <Card className="custom-card m-0 dashboard-card-accordian" style={{ boxShadow: 'none' }}>
                            <Card.Body className="p-1 dashboard-card-boday-accordian">
                              kindly note the timings for the exam: From 19/09/22 Monday to 23/09/22 Friday will be regular full working day. From 26/09/22
                              Monday to 30/09/22 Friday will be 10.30 am to 1.00 pm.
                            </Card.Body>
                          </Card>
                        </Row>
                      </Col>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Card.Body>
          </Card>
        </Col>

      </Row>

    </Fragment>
  )
}

export default React.memo(Dashboard);