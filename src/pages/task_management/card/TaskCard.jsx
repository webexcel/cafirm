import React from 'react'
import faces8 from '../../../assets/images/brand-logos/desktop-dark.png'
import faces2 from '../../../assets/images/brand-logos/desktop-dark.png'
import { Link } from "react-router-dom";
import { Button, Card } from 'react-bootstrap';

const TaskCard = React.memo(({ idx, handlerOnTaskChange, handlerPauseTask, onHandleDelete }) => {
    return (
        <Card className="custom-card task-inprogress-card">
            <Card.Body className="">
                <div className="d-flex justify-content-between">
                    <div>
                        <Link to="#" className="fs-14 fw-semibold mb-3 d-flex align-items-center">{idx?.task_name || idx?.ticket_name}</Link>
                        <p className="mb-3">Status : <span className={`badge bg-danger`}>{idx.statusLabel}</span></p>
                        <p className="mb-0">Assigned To : </p>
                        <span className="avatar-list-stacked ms-1">
                            <span className="avatar avatar-sm avatar-rounded">
                                <img src={faces2} alt="user-img" />
                            </span>
                            <span className="avatar avatar-sm avatar-rounded">
                                <img src={faces8} alt="user-img" />
                            </span>
                            <span className="avatar avatar-sm avatar-rounded">
                                <img src={faces2} alt="user-img" />
                            </span>
                        </span>
                        <span className="me-2">
                            <Button variant="" aria-label="button" type="button" className="btn btn-sm btn-icon btn-wave btn-primary-light waves-effect waves-light"
                                // onClick={handleShow1}
                                data-bs-toggle="modal" data-bs-target="#addpromodal"><i className="ri-add-fill"></i></Button></span>

                    </div>
                    <div>
                        <div className="btn-list">
                            {
                                idx.switchBack && (
                                    <Button variant="" type="button" aria-label="button" className={`btn btn-sm btn-icon btn-wave btn-${idx.switchBackIcon}-light me-2`}
                                        onClick={() => { handlerPauseTask(idx) }}
                                    ><i className="bi bi-pause-circle"></i></Button>

                                )
                            }
                            {
                                idx.completedBtn && (
                                    <Link to="#" className="btn btn-sm btn-icon btn-wave btn-success-light">
                                        <i className="bi-check-circle" onClick={() => { handlerOnTaskChange(idx) }}></i>
                                    </Link>
                                )
                            }
                            <Button
                                onClick={() => { onHandleDelete(idx) }}
                                variant=""
                                type="button"
                                aria-label="button"
                                className="btn btn-sm btn-icon btn-wave btn-danger-light me-0"
                            ><i className="ri-delete-bin-line"></i></Button>
                        </div>
                        <span className={`footer-badge badge bg-${'primary'}-transparent d-block`}>{idx.priority}</span>
                    </div>
                </div>
            </Card.Body>
        </Card>
    )
})

export default TaskCard
