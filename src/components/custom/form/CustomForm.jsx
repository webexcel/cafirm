import React from "react";
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
  btnText
}) => {
  const handleDateChange = (date, name) => {
    // Store the date as a string in ISO format (YYYY-MM-DD)
    onChange({ target: { name, value: date ? date.toISOString().split("T")[0] : "" } }, name);
  };

  // console.log("errorrrr", errors);

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
            style={{ width: "100%" }}>
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
              onChange={(date) => handleDateChange(date, field.name)}
              isClearable
              dateFormat="yyyy/MM/dd"
              placeholderText="Select date range"
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
              field.type === "textarea" ? 6 : field.type === "multiPanelSelect" ? 12 : field.type === "checktable" ? 12 : 3
            }
            sm={12}
            className="">
            {/* Adjust width of input fields */}
            <Form.Group
              controlId={field.name}
              className={
                field.type === "multiPanelSelect" || "" ? "custom-full-width" : ""
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

        <Col md={3} sm={12} className="justify-content-start">
          <Button
            type="submit"
            variant="primary"
            className="btn btn-wave mb-3 w-50 py-1">
            {btnText || "Add"}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default CustomForm;
