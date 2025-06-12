import React, { useRef, useState } from "react";
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
  inputRef
}) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;

  const handleDateChange = (date, name) => {

    console.log("datee", date)
    if (String(name) === "dates") {
      setDateRange(date);
      onChange({ target: { name, value: date || "" } }, name);
      return;
    }

    if (date) {
      // Ensure the date is stored in 'YYYY-MM-DD' format without time zone issues
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Ensure two digits
      const day = String(date.getDate()).padStart(2, "0"); // Ensure two digits

      const formattedDate = `${year}-${month}-${day}`;

      onChange({ target: { name, value: formattedDate } }, name);
    } else {
      onChange({ target: { name, value: "" } }, name);
    }
  };

  const [startDate1, setStartDate] = useState(null);

  const renderField = (field) => {
    // console.log('form fieldsssss in custom form', field.name, formData[field.name])
    if (field.show && !field.show(showCustomMultiPanelSelect)) {
      return null;
    }

    switch (field.type) {
      case "text":
        return (
          <Form.Control
            type="text"
            name={field.name}
            value={formData[field.name] || ""}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e, field.name)}
            isInvalid={!!errors[field.name]}
            style={{ width: "100%" }}
            maxLength={field.maxLength || 100}
          />
        );
      case "hidden":
        return (
          <Form.Control
            type="hidden"
            name={field.name}
            value={formData[field.name] || ""}
          />
        );
      case "number":
        return (
          <Form.Control
            type="number"
            name={field.name}
            value={formData[field.name] || ""}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e, field.name)}
            isInvalid={!!errors[field.name]}
            style={{ width: "100%" }}
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
            style={{ width: "100%" }}
            disabled={field?.disabled && field.disabled}
          >
            {
              field.name == "staffperiodtype" ? null : <option value={""}>Select {field.label}</option>
            }
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
            styles={{
              control: (provided, state) => ({
                ...provided,
                width: '100%',
                borderColor: state.isFocused ? 'transparent' : provided.borderColor,
                '&:hover': {
                  borderColor: provided.borderColor
                }
              })
            }}
          />
        );

      case "textarea":
        return (
          <Form.Control
            type="textarea"
            name={field.name}
            value={formData[field.name] || ""}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e, field.name)}
            isInvalid={!!errors[field.name]}
            style={{ width: "100%" }}
            // maxLength={field.maxLength || 500}
            as="textarea"
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
            className="js-example-placeholder-multiple w-full js-states"
            menuPlacement="auto"
            classNamePrefix="Select2"
            placeholder={field.placeholder}
            onChange={(e) => onChange(e, field.name)}
            isInvalid={!!errors[field.name]}
            style={{ width: "100%", minHeight: "50px" }}
          />
        );
      case "multiPanelSelect":
        return (
          <CustomMultiPanelSelect
            field={field}
            onStateChange={(newState) => {
              console.log("Panel state updated:", newState);
              onPanelStateChange(newState);
            }}
          />
        );

      case "checktable":
        return (
          field?.tabledata?.data ?
            <CustomTable
              {...field.tabledata}
              onCheck={true}
            /> : null
        );

      case "Templatebutton":
        return (
          <Button className="btn btn-sm px-5 py-2 mx-auto" onClick={() => { customOnClick(field.value) }}>{field.label}</Button>
        );
      case "date":
        return (
          <div
            style={{ position: "relative", display: "inline-block", width: '100%' }}
          >
            <DatePicker
              name={field.name}
              value={formData[field.name] || ""}
              selected={formData[field.name] ? new Date(formData[field.name]) : null}
              onChange={(date) => handleDateChange(date, field.name)}
              placeholderText={field.placeholder}
              className="form-control"
              isInvalid={formData[field.name] || ""}
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
          <div
            style={{ position: "relative", display: "inline-block", width: '100%' }}
          >
            <DatePicker
              selectsRange
              startDate={startDate}
              endDate={endDate}
              onChange={(date) => handleDateChange(date, field.name)}
              isClearable
              dateFormat="yyyy/MM/dd"
              placeholderText="Select date range"
              className="form-control"
              isInvalid={formData[field.name] || ""}
            />
            {/* <FaCalendarAlt
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
                color: "#6c757d",
              }}
            /> */}
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
            selected={formData[field.name]}
            onChange={(e) => onChange(e, field.name)}
            showYearPicker
            dateFormat="yyyy"
            className="form-control"
            placeholderText="Select Year"
          />

        );

      case "email":
        return (
          <Form.Control
            type="email"
            name={field.name}
            value={formData[field.name] || ""}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e, field.name)}
            isInvalid={!!errors[field.name]}
            style={{ width: "100%" }}
          />
        );

      case "file":
        return (
          <Form.Control
            // key={formData[field.name]}
            ref={inputRef}
            type="file"
            name={field.name}
            onChange={(e) => onChange(e, field.name)}
            isInvalid={!!errors[field.name]}
            style={{ width: "100%" }}
            accept={field.accept || "*"}
          />
        );

      default:
        return null;
    }
  };


  const columnWidth = Math.floor(12 / formFields.length);

  return (
    <Form onSubmit={onSubmit}>
      <Row className="g-3">
        {formFields.map((field, idx) => (
          <Col
            key={idx}
            md={
              field.type === "textarea"
                ? 6
                : field.type === "multiPanelSelect"
                  ? 12
                  : field.type === "checktable"
                    ? 12
                    : 3
            }
            sm={12}
            className="">
            {/* Adjust width of input fields */}
            <Form.Group
              controlId={field.name}
              className={
                field.type === "multiPanelSelect" || ""
                  ? "custom-full-width"
                  : ""
              }>
              {/* <Form.Label>{field.label}</Form.Label> */}
              {renderField(field)}
              {errors[field.name] &&
                (console.log(errors, "test"),
                  (
                    <Form.Control.Feedback type="invalid">
                      {errors[field.name]}
                    </Form.Control.Feedback>
                  ))}
            </Form.Group>
          </Col>
        ))}
        {showAddButton && !onEdit && (
          <Col md={3} sm={12} className="justify-content-start">
            <Button
              type="submit"
              variant="primary"
              className="btn btn-wave mb-3 w-50 py-1">
              {btnText || 'Add'}
            </Button>
          </Col>
        )}

        {showUpdateButton && onEdit && (
          <Col md={3} sm={12} className="justify-content-start">
            <Button
              type="submit"
              variant="primary"
              className="btn btn-wave mb-3 w-50 py-1">
              Update
            </Button>
          </Col>
        )}
      </Row>
    </Form>
  );
};

export default CustomForm;
