import React, { useState } from "react";
import { Table, OverlayTrigger, Tooltip, Pagination, Button, Form } from "react-bootstrap";
import demoimage from "../../../assets/images/apps/calender.png";

const CustomTable = ({
  columns,
  data,
  onEdit,
  onDelete,
  onCheck,
  onActive,
  inActive,
  onCopyTo,
  handlerEdit,
  disableOnEdit = false,
  showDeleteButton = true,
  showUpdateButton = false
}) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingData, setEditingData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const recordsPerPage = 10;
  const totalRecords = data.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    if (!sortConfig.key) return data;
    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key] ?? "";
      const bVal = b[sortConfig.key] ?? "";

      if (typeof aVal === "number" && typeof bVal === "number") {
        return sortConfig.direction === "asc" ? aVal - bVal : bVal - aVal;
      }

      return sortConfig.direction === "asc"
        ? String(aVal).localeCompare(String(bVal))
        : String(bVal).localeCompare(String(aVal));
    });
  }, [data, sortConfig]);

  const currentData = sortedData.slice(indexOfFirstRecord, indexOfLastRecord);

  const handleEditClick = (row, index) => {
    if (disableOnEdit) {
      onEdit(row, index);
    } else {
      setEditingIndex(index);
      setEditingData(row);
    }
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
        <Pagination.Item key={i} active={i === currentPage} onClick={() => handlePageChange(i)}>
          {i}
        </Pagination.Item>
      );
    }

    return items;
  };

  const showActions =
    (showDeleteButton && onDelete) ||
    (showUpdateButton && (onEdit || handlerEdit)) ||
    onCheck ||
    onActive ||
    inActive ||
    onCopyTo;

  return (
    <>
      <div className="table-responsive">
        <Table className="table table-hover text-nowrap table-striped">
          <thead>
            <tr>
              {columns.map((col, index) => {
                if (col.accessor === "Actions" && !showActions) return null;
                return (
                  <th
                    key={index}
                    scope="col"
                    onClick={() => col.accessor !== "Actions" && handleSort(col.accessor)}
                    style={{ cursor: col.accessor !== "Actions" ? "pointer" : "default" }}
                  >
                    {col.header}
                    {sortConfig.key === col.accessor && (
                      <span className="ms-1">{sortConfig.direction === "asc" ? "▲" : "▼"}</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          {data.length > 0 ? (
            <tbody>
              {currentData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-3">
                      {col.accessor === "Actions" ? (
                        rowIndex === editingIndex ? (
                          <div className="d-flex justify-content-start">
                            <OverlayTrigger placement="top" overlay={<Tooltip>Save</Tooltip>}>
                              <a className="btn btn-success btn-sm" onClick={() => handleSave(rowIndex)}>
                                <span className="ri-check-line fs-14"></span>
                              </a>
                            </OverlayTrigger>
                            <OverlayTrigger placement="top" overlay={<Tooltip>Cancel</Tooltip>}>
                              <a className="btn btn-danger btn-sm ms-2" onClick={handleCancel}>
                                <span className="ri-close-line fs-14"></span>
                              </a>
                            </OverlayTrigger>
                          </div>
                        ) : (
                          <div className="d-flex justify-content-start gap-2">
                            {onEdit && showUpdateButton && (
                              <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                                <a
                                  href="#"
                                  className="btn btn-icon btn-sm btn-info"
                                  onClick={() => handleEditClick(row, rowIndex)}
                                >
                                  <i className="ri-edit-line"></i>
                                </a>
                              </OverlayTrigger>
                            )}
                            {handlerEdit && showUpdateButton && (
                              <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                                <a
                                  href="#"
                                  className="btn btn-icon btn-sm btn-info"
                                  onClick={() => handlerEdit(row, rowIndex)}
                                >
                                  <i className="ri-edit-line"></i>
                                </a>
                              </OverlayTrigger>
                            )}
                            {onDelete && showDeleteButton && (
                              <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                                <a
                                  href="#"
                                  className={`btn btn-icon btn-sm btn-secondary ${row.total_minutes > 0 ? "disabled" : ""}`}
                                  onClick={() => {
                                    if (!row.total_minutes || row.total_minutes === 0) {
                                      onDelete(row, rowIndex);
                                    }
                                  }}
                                  style={{
                                    pointerEvents: row.total_minutes > 0 ? "none" : "auto",
                                    opacity: row.total_minutes > 0 ? 0.5 : 1
                                  }}
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
                                  className="btn btn-icon btn-sm btn-secondary p-2"
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
                                  className="btn btn-icon btn-sm btn-success p-2"
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
                                  className="btn btn-icon btn-sm btn-success p-2"
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
                          {["assignTo", "assigned_to"].includes(col.accessor) ? (
                            <div className="avatar-list-stacked">
                              {row[col.accessor]?.map((data, index) => (
                                <OverlayTrigger key={index} placement="top" overlay={<Tooltip>{data.label}</Tooltip>}>
                                  <span className="avatar avatar-sm avatar-rounded" style={{ width: "30px", height: "30px" }}>
                                    <img src={data.image || demoimage} alt="avatar" />
                                  </span>
                                </OverlayTrigger>
                              ))}
                            </div>
                          ) : col.accessor === "operations" ? (
                            <span>
                              {row[col.accessor]?.map((data) => data.label || "").filter(Boolean).join(", ")}
                            </span>
                          ) : ["pending", "critical"].includes(String(row[col.accessor]).toLowerCase()) ? (
                            <span className="badge bg-danger">{row[col.accessor]}</span>
                          ) : ["in-progress", "medium"].includes(String(row[col.accessor]).toLowerCase()) ? (
                            <span className="badge bg-warning">{row[col.accessor]}</span>
                          ) : String(row[col.accessor]).toLowerCase() === "completed" ? (
                            <span className="badge bg-success">{row[col.accessor]}</span>
                          ) : String(row[col.accessor]).toLowerCase() === "low" ? (
                            <span className="badge bg-info">{row[col.accessor]}</span>
                          ) : (
                            row[col.accessor]
                          )}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan={columns.length} className="text-center py-3 fs-16 fw-semi-bold">
                  No records found!
                </td>
              </tr>
            </tbody>
          )}
        </Table>

        {data.length > 0 && (
          <div className="d-flex align-items-center justify-content-between mt-3">
            <div>
              Showing {indexOfFirstRecord + 1} to {Math.min(indexOfLastRecord, totalRecords)} of {totalRecords} Entries
            </div>
            <Pagination className="justify-content-center">
              <Pagination.Item disabled={currentPage === 1} onClick={() => handlePageChange(1)}>
                <i className="bi-chevron-double-left fs-13"></i>
              </Pagination.Item>
              <Pagination.Item disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
                <i className="ri-arrow-left-s-line"></i>
              </Pagination.Item>
              {renderPaginationItems()}
              <Pagination.Item disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
                <i className="ri-arrow-right-s-line"></i>
              </Pagination.Item>
              <Pagination.Item disabled={currentPage === totalPages} onClick={() => handlePageChange(totalPages)}>
                <i className="bi-chevron-double-right fs-13"></i>
              </Pagination.Item>
            </Pagination>
          </div>
        )}
      </div>
    </>
  );
};

export default CustomTable;
