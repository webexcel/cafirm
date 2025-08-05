import React, { useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";
import Select from "react-select";
import CustomMultiPanelSelect from "../panel/CustomMultiPanelSelect";
import CustomTable from "../table/CustomTable";
import DatePicker from "react-datepicker";
import { FaCalendarAlt } from "react-icons/fa";
import TimeInput from "../../../pages/task_management/TimerSelector";

const CustomForm = ({
  formFields,
  formData,
  errors,
  onChange,
  onSubmit,
  showCustomMultiPanelSelect,
  onPanelStateChange,
  showCheckedTable,
  customOnClick,
  btnText,
  onEdit = false,
  showAddButton = true,
  showUpdateButton = true,
  inputRef,
  dateLimits
}) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const handleDateChange = (date, name) => {
    if (String(name) === "dates") {
      setDateRange(date);
      onChange({ target: { name, value: date || "" } }, name);
      return;
    }

    if (date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;
      onChange({ target: { name, value: formattedDate } }, name);
    } else {
      onChange({ target: { name, value: "" } }, name);
    }
  };

  const renderField = (field) => {
    if (field.show && !field.show(showCustomMultiPanelSelect)) return null;

    switch (field.type) {
      case "text":
      case "number":
      case "email":
      case "hidden":
        return (
          <Form.Control
            type={field.type}
            name={field.name}
            value={formData[field.name] || ""}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e, field.name)}
            isInvalid={!!errors[field.name]}
            maxLength={field.maxLength || 100}
          />
        );

      case "timer":
        return (
          <TimeInput field={field} onChange={onChange} formData={formData} errors={errors} />
        );

      case "dropdown":
        return (
          <Form.Select
            name={field.name}
            value={formData[field.name] || ""}
            onChange={(e) => onChange(e, field.name)}
            isInvalid={!!errors[field.name]}
            disabled={field?.disabled && field.disabled}
          >
            {field.name === "staffperiodtype" ? null : (
              <option value="">Select {field.label}</option>
            )}
            {field.options.map((option, idx) => (
              <option key={idx} value={option.value}>
                {option.label}
              </option>
            ))}
          </Form.Select>
        );

      case "searchable_dropdown":
        return (
          <Select
            name={field.name}
            value={field.options.find(option => option.value === formData[field.name]) || null}
            onChange={(selectedOption) =>
              onChange({ target: { name: field.name, value: selectedOption?.value || "" } }, field.name)
            }
            options={field.options}
            isSearchable
            placeholder={`Select ${field.label}`}
            isDisabled={field.disable || false}
          />
        );

      case "textarea":
        return (
          <Form.Control
            as="textarea"
            name={field.name}
            value={formData[field.name] || ""}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e, field.name)}
            isInvalid={!!errors[field.name]}
            rows={1}
          />
        );

      case "multiSelect":
        return (
          <Select
            isMulti
            name={field.name}
            options={field.options}
            value={formData[field.name] || ""}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e, field.name)}
          />
        );

      case "multiPanelSelect":
        return (
          <CustomMultiPanelSelect
            field={field}
            onStateChange={(newState) => onPanelStateChange(newState)}
          />
        );

      case "checktable":
        return field?.tabledata?.data ? (
          <CustomTable {...field.tabledata} onCheck={true} />
        ) : null;

      case "Templatebutton":
        return (
          <Button className="btn btn-sm px-5 py-2 mx-auto" onClick={() => customOnClick(field.value)}>
            {field.label}
          </Button>
        );

      case "date":
      case "datebetween":
        return (
          <div style={{ position: "relative", width: "100%" }}>
            <DatePicker
              name={field.name}
              selected={formData[field.name] ? new Date(formData[field.name]) : null}
              onChange={(date) => handleDateChange(date, field.name)}
              placeholderText={field.placeholder}
              className="form-control"
              minDate={field.type === "datebetween" && dateLimits?.start ? new Date(dateLimits.start) : null}
              maxDate={field.type === "datebetween" && dateLimits?.end ? new Date(dateLimits.end) : null}
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
        );

      case "daterange":
        return (
          <div style={{ position: "relative", width: "100%" }}>
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(date) => handleDateChange(date, field.name)}
              isClearable
              dateFormat="yyyy/MM/dd"
              placeholderText="Select date range"
              className="form-control"
            />
          </div>
        );

      case "monthlydatepicker":
        return (
          <DatePicker
            selected={formData[field.name] ? new Date(formData[field.name]) : null}
            onChange={(e) => onChange(e, field.name)}
            showMonthYearPicker
            dateFormat="MM/yyyy"
            className="form-control"
            placeholderText="Select Month"
          />
        );

      case "weeklydatepicker":
        return (
          <DatePicker
            selected={formData[field.name] ? new Date(formData[field.name]) : null}
            onChange={(e) => onChange(e, field.name)}
            showWeekNumbers
            dateFormat="yyyy, 'Week' ww"
            placeholderText="Select week"
            className="form-control"
            disabled={field.disable}
          />
        );

      case "yearlydatepicker":
        return (
          <DatePicker
            selected={formData[field.name] ? new Date(formData[field.name]) : null}
            onChange={(e) => onChange(e, field.name)}
            showYearPicker
            dateFormat="yyyy"
            className="form-control"
            placeholderText="Select Year"
          />
        );

      case "file":
        return (
          <Form.Control
            ref={inputRef}
            type="file"
            name={field.name}
            onChange={(e) => onChange(e, field.name)}
            isInvalid={!!errors[field.name]}
            accept={field.accept || "*"}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Form onSubmit={onSubmit}>
      <Row className="g-3">
        {formFields.map((field, idx) => (
          <Col
            key={idx}
            xs={12}
            sm={12}
            md={field.type === "textarea" || field.type === "multiPanelSelect" || field.type === "checktable" ? 6 : 6}
            lg={field.type === "textarea" || field.type === "multiPanelSelect" || field.type === "checktable" ? 6 : 4}
            xl={field.type === "textarea" || field.type === "multiPanelSelect" || field.type === "checktable" ? 6 : 3}
          >
            <Form.Group controlId={field.name} className="mb-3">
              {renderField(field)}
              <div className="text-danger">{errors[field.name]}</div>
            </Form.Group>
          </Col>
        ))}

        {showAddButton && !onEdit && (
          <Col xs={12} sm={12} md={6} lg={4} xl={3}>
            <Button type="submit" variant="primary" className="btn btn-wave mb-1 w-50 py-1">
              {btnText || "Add"}
            </Button>
          </Col>
        )}

        {showUpdateButton && onEdit && (
          <Col xs={12} sm={12} md={6} lg={4} xl={3}>
            <Button type="submit" variant="primary" className="btn btn-wave mb-3 w-100 py-2">
              Update
            </Button>
          </Col>
        )}
      </Row>
    </Form>
  );
};

export default CustomForm;
