import React from 'react'
import { Card } from 'react-bootstrap'

const DashboardCard = ({ Title, Count }) => {
    return (
        <Card className="custom-card">
            <Card.Body className="">
                <div className="d-flex align-items-center">
                    <div className="me-2">
                        <div className="avatar avatar-lg bg-info-transparent text-info">
                            <i className="fe fe-users"></i>
                        </div>
                    </div>
                    <div className="flex-1">
                        <div className="">
                            <p className="mb-0  text-muted">{Title}</p>
                        </div>
                        <div className="flex-between">
                            <h3 className="fs-20 mb-0 font-weight-normal">{Count}</h3>
                            {/* <span className="text-info"><i className="ti ti-arrow-up-right me-1 fs-14"></i>+12.86%</span> */}
                        </div>
                        {/* <span className="badge bg-info-transparent">This Month</span> */}
                    </div>
                </div>
            </Card.Body>
        </Card>
    )
}

export default DashboardCard
