import React from 'react'
import { Card } from "react-bootstrap";
import { Link } from 'react-router-dom';

const CustomCard = ({ title, icon, value, field1, field2 }) => {
    return (
        <Card className="custom-card">
            <Card.Body className="p-0">
                <div className="p-3">
                    <div className="d-flex pos-relative flex-wrap">
                        <Link aria-label="anchor" to="#" className="masked-link"></Link>
                        <Link aria-label="anchor" to="#" className="pe-2">
                            <span className="avatar border bd-gray-100 text-primary"><i className={`${icon} fs-5 w-100 d-flex justify-content-center`}                                ></i></span>
                        </Link>
                        <div className="flex-1">
                            <div className="flex-between mb-1 fs-10">
                                <span className="fw-bold mb-1 text-muted">{title}</span>
                                {/* <span className="text-success text-end"><i className="ti ti-trending-up fs-11 me-1 ms-2"></i>0.14%</span> */}
                            </div>
                            <div className="flex-between fs-17 mb-3">
                                <span className="mx-1 fw-medium">{value}</span>
                            </div>
                        </div>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        {/* <span className="badge bg-danger-transparent px-3 py-2 fs-7">{field1}</span> */}
                        <span
                            className="badge bg-danger-transparent text-danger">{field1}
                        </span>
                        <span
                            className="badge bg-info-transparent text-info">{field2}
                        </span>
                        {/* <span className="badge bg-info-transparent px-3 py-2 fs-7">{field2}</span> */}
                    </div>
                </div>
            </Card.Body>
        </Card>
    )
}

export default CustomCard
