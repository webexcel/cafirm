import React, { useEffect, useState } from "react";
import { Form, Button, Row, Col } from "react-bootstrap";

const CustomMultiPanelSelect = ({ field, onStateChange }) => {
  const [panelState, setPanelState] = useState({
    available: field.options.available || [],
    selected: field.options.selected || [],
    selectedFromAvailable: [],
    selectedFromSelected: [],
  });


  console.log('available dataaa', field, field.options.available)

  useEffect(() => {
    setPanelState((prevState) => ({
      ...prevState,
      available: field.options?.available || [],
    }));
  }, [field.options?.available]);

  const handlePanelStateChange = (key, value) => {
    setPanelState((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleTransfer = (fromKey, toKey, selectedValues) => {
    setPanelState((prevState) => {
      const fromItems = prevState[fromKey];
      const toItems = prevState[toKey];

      // Filter and move items
      const transferringItems = fromItems.filter((item) =>
        selectedValues.includes(String(item.value))
      );
      const updatedFrom = fromItems.filter(
        (item) => !selectedValues.includes(String(item.value))
      );
      const updatedTo = [...toItems, ...transferringItems];

      // Notify parent about state change
      onStateChange && onStateChange({ ...prevState, [fromKey]: updatedFrom, [toKey]: updatedTo });

      return {
        ...prevState,
        [fromKey]: updatedFrom,
        [toKey]: updatedTo,
        selectedFromAvailable: [],
        selectedFromSelected: [],
      };
    });
  };

  return (
    <Row className="mt-4">
      <Col xl={5}>
        <Form.Select
          multiple
          className="form-select"
          onChange={(e) =>
            handlePanelStateChange(
              "selectedFromAvailable",
              Array.from(e.target.selectedOptions, (option) => option.value)
            )
          }
          style={{ height: "300px", overflowY: "auto" }}
        >
          {console.log('panel state', panelState)}
          {panelState.available.map((data, index) => (
            <option
              key={index}
              className={`py-2 ${panelState.selectedFromAvailable.includes(data.value) ? "bg-info" : ""
                }`}
              value={data.value}
            >
              {data.label}
            </option>
          ))}
        </Form.Select>
      </Col>

      <Col
        xl={2}
        className="d-flex flex-column justify-content-center align-items-center gap-3"
      >
        <Button
          onClick={() =>
            handleTransfer(
              "available",
              "selected",
              panelState.selectedFromAvailable
            )
          }
        >
          <i className="bi bi-fast-forward-fill"></i>
        </Button>
        <Button
          onClick={() =>
            handleTransfer(
              "selected",
              "available",
              panelState.selectedFromSelected
            )
          }
        >
          <i className="bi bi-rewind-fill"></i>
        </Button>
      </Col>

      <Col xl={5}>
        <Form.Select
          multiple
          className="form-select"
          onChange={(e) =>
            handlePanelStateChange(
              "selectedFromSelected",
              Array.from(e.target.selectedOptions, (option) => option.value)
            )
          }
          style={{ height: "300px", overflowY: "auto" }}
        >
          {panelState.selected.map((data, index) => (
            <option
              key={index}
              className={`py-2 ${panelState.selectedFromSelected.includes(data.value) ? "bg-info" : ""
                }`}
              value={data.value}
            >
              {data.label}
            </option>
          ))}
        </Form.Select>
      </Col>
    </Row>
  );
};

export default CustomMultiPanelSelect;
