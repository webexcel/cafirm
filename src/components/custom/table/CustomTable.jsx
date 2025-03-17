import React, { useState } from "react";
import { Table, OverlayTrigger, Tooltip, Pagination, Button, Form, Popover } from "react-bootstrap";
import ColumnPopOver from '../popover/ColumnPopOver'
const CustomTable = ({ columns, data, onEdit, onDelete, onCheck, onActive, inActive, onCopyTo, handlerEdit }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const recordsPerPage = 10;
  const totalRecords = data.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentData = data.slice(indexOfFirstRecord, indexOfLastRecord);

  const handleEditClick = (row, index) => {
    setEditingIndex(index);
    setEditingData(row);
  };

  const handleInputChange = (e, accessor) => {
    const { value } = e.target;
    setEditingData((prev) => ({ ...prev, [accessor]: value }));
  };

  const handleSave = (index) => {
    onEdit(indexOfFirstRecord + index, editingData);
    setEditingIndex(null);
  };

  const handleCancel = () => {
    setEditingIndex(null);
    setEditingData({});
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setEditingIndex(null);
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    return items;
  };

  console.log("table datttaaaaaa", data)

  return (
    <>
      <div className="table-responsive">
        <Table className="table table-hover text-nowrap table-striped">
          <thead>
            <tr>
              {columns.map((col, index) => (
                <th key={index} scope="col" className="">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentData.map((row, rowIndex) => (
              // <ColumnPopOver data={row}>
              <tr key={rowIndex}>
                {columns.map((col, colIndex) => (

                  <td key={colIndex} className="px-3">
                    {col.accessor === "Actions" ? (
                      rowIndex === editingIndex ? (
                        <div className="d-flex justify-content-start">
                          <OverlayTrigger placement="top" overlay={<Tooltip>Save</Tooltip>}>
                            <a
                              aria-label="save"
                              className="btn btn-success btn-sm"
                              onClick={() => handleSave(rowIndex)}
                            >
                              <span className="ri-check-line fs-14"></span>
                            </a>
                          </OverlayTrigger>
                          <OverlayTrigger placement="top" overlay={<Tooltip>Cancel</Tooltip>}>
                            <a
                              aria-label="cancel"
                              className="btn btn-danger btn-sm ms-2"
                              onClick={handleCancel}
                            >
                              <span className="ri-close-line fs-14"></span>
                            </a>
                          </OverlayTrigger>
                        </div>
                      ) : (
                        <div className="d-flex justify-content-start gap-2">
                          {onEdit && (
                            <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                              <a
                                href="#"
                                className="btn btn-icon btn-sm btn-info d-flex justify-content-center align-items-center"
                                onClick={() => handleEditClick(row, rowIndex)}
                              >
                                <i className="ri-edit-line"></i>
                              </a>
                            </OverlayTrigger>
                          )}

                          {handlerEdit && (
                            <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                              <a
                                href="#"
                                className="btn btn-icon btn-sm btn-info d-flex justify-content-center align-items-center"
                                onClick={() => handlerEdit(row, rowIndex)}
                              >
                                <i className="ri-edit-line"></i>
                              </a>
                            </OverlayTrigger>
                          )}

                          {onDelete && (
                            <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                              <a
                                href="#"
                                className="btn btn-icon btn-sm btn-secondary d-flex justify-content-center align-items-center"
                                onClick={() => onDelete(row, rowIndex)}
                              >
                                <i className="ri-delete-bin-line"></i>
                              </a>
                            </OverlayTrigger>
                          )}

                          {onCheck && <Form.Check type="checkbox" />}

                          {onActive && (
                            <OverlayTrigger placement="top" overlay={<Tooltip>InActive</Tooltip>}>
                              <a
                                href="#"
                                className="btn btn-icon btn-sm btn-secondary d-flex justify-content-center align-items-center p-2"
                                onClick={() => onActive(row, rowIndex)}
                              >
                                <i className="bi bi-toggle-on fs-16"></i>
                              </a>
                            </OverlayTrigger>
                          )}

                          {inActive && (
                            <OverlayTrigger placement="top" overlay={<Tooltip>Active</Tooltip>}>
                              <a
                                href="#"
                                className="btn btn-icon btn-sm btn-success d-flex justify-content-center align-items-center p-2"
                                onClick={() => inActive(row, rowIndex)}
                              >
                                <i className="bi bi-toggle-on fs-16"></i>
                              </a>
                            </OverlayTrigger>
                          )}


                          {onCopyTo && (
                            <OverlayTrigger placement="top" overlay={<Tooltip>Copy To</Tooltip>}>
                              <a
                                href="#"
                                className="btn btn-icon btn-sm btn-success d-flex justify-content-center align-items-center p-2"
                                onClick={() => onCopyTo(row, rowIndex)}
                              >
                                <i className="bi bi-clipboard-check fs-16"></i>
                              </a>
                            </OverlayTrigger>
                          )}

                        </div>

                      )
                    ) : editingIndex === rowIndex && col.editable ? (
                      col.options ? (
                        <Form.Select
                          value={editingData[col.accessor] || ""}
                          onChange={(e) => handleInputChange(e, col.accessor)}
                          className="form-control form-control-sm"
                          style={{ width: "100%" }}
                        >
                          <option value="">Select Any</option>
                          {col.options.map((option, idx) => (
                            <option key={idx} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Form.Select>
                      ) : (
                        <input
                          type="text"
                          value={editingData[col.accessor] || ""}
                          onChange={(e) => handleInputChange(e, col.accessor)}
                          className="form-control form-control-sm text-start"
                          style={{ width: "70%" }}
                        />
                      )
                    ) : (
                      <span>
                        {(col.accessor === "assignTo" || col.accessor === "assigned_to")
                          ? row[col.accessor]?.map((data) => data?.label || '').filter(Boolean).join(', ')
                          : String(row[col.accessor] || "").trim().toLowerCase() === "pending"
                            ? (<span className="badge bg-danger">{row[col.accessor]}</span>)
                            : String(row[col.accessor] || "").toLowerCase() === "In-progress"
                              ? (<span className="badge bg-warning">{row[col.accessor]}</span>)
                              : String(row[col.accessor] || "").trim().toLowerCase() === "completed"
                              ? (<span className="badge bg-success">{row[col.accessor]}</span>) : 
                              row[col.accessor]}
                      </span>

                    )}
                  </td>

                ))}

              </tr>
              // </ColumnPopOver>
              // String(row[col.accessor][0]?.label || "" )
            ))}
          </tbody>
        </Table>
        <div className="d-flex align-items-center justify-content-between mt-3">
          <div>
            Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, totalRecords)} of{" "}
            {totalRecords} Entries
          </div>
          <Pagination className="justify-content-center">
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            />
            {renderPaginationItems()}
            <Pagination.Next
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            />
          </Pagination>
        </div>
      </div>
    </>
  );
};

export default CustomTable;
