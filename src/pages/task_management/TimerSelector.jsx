import React, { useState } from "react";
import { Form } from "react-bootstrap";
import InputMask from 'react-input-mask';

const TimeInput = ({ field, onChange, formData, errors }) => {
  const [time, setTime] = useState("");

  return (
    //   <Form.Control
    //   type="time"
    //   name={field.name}
    //   value={formData[field.name] || ""}
    //   placeholder={field.placeholder}
    //   onChange={(e) => onChange(e, field.name)}
    //   step="60"
    //   className="form-control"
    //   style={{
    //     width: "100%",
    //     border: `${!!errors[field.name] ? "1px solid red" : "1px solid #ced4da"}`,
    //     borderRadius: "0.375rem",
    //     padding: "0.2rem 0.75rem",
    //     height: "32px",
    //     outline: "none",
    //     appearance: "textfield",
    //   }}
    //   pattern="[0-9]{2}:[0-9]{2}"
    // />

    <InputMask
      mask="99:99"
      maskChar={null}
      name={field.name}
      value={formData[field.name] || ""}
      onChange={(e) => onChange(e, field.name)}
      placeholder="HH:MM"
      pattern="^([01]?[0-9]|2[0-3]):[0-5][0-9]$"
      title="Enter time in HH:MM format (24-hour)"
      className="form-control"
      style={{
        width: "100%",
        border: `${!!errors[field.name] ? "1px solid red" : "1px solid #ced4da"}`,
        borderRadius: "0.375rem",
        padding: "0.2rem 0.75rem",
        height: "32px",
        outline: "none",
        appearance: "textfield",
      }}
    />

  );
};

export default TimeInput;
