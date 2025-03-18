import React, { useEffect, useState } from "react";
import { Form, FormGroup, FormLabel, FormControl, Row, Col, Container } from "react-bootstrap";

const ColorPicker = React.memo(({ onChangeColor, defaultColor }) => {
  // State to manage the selected color and custom color
  const [selectedColor, setSelectedColor] = useState(() => {
    return defaultColor ? defaultColor : "#3788d8"
  });
  //   const [selectedColor, setSelectedColor] = useState(
  //  "#3788d8"
  // );
  const [customColor, setCustomColor] = useState("#000000");

  // Predefined color options
  const predefinedColors = [
    { label: "Red", value: "#ff0000" },
    { label: "Sky Blue", value: "#3788d8" },
    { label: "Green", value: "#00ff00" },
    { label: "Blue", value: "#0000ff" },
    { label: "Yellow", value: "#ffff00" },
    { label: "Purple", value: "#800080" },
  ];

  useEffect(() => {
    onChangeColor(selectedColor)
  }, [])

  // Handle change in color selection (from predefined or custom)
  const handleSelectChange = (event) => {
    const selected = event.target.value;
    console.log('seleted color : ',selected)
    setSelectedColor(selected);
    onChangeColor(selected)
  };

  // Handle change in custom color picker
  const handleColorPickerChange = (event) => {
    const custom = event.target.value;
    console.log('Picked color : ',custom)
    setCustomColor(custom);
    setSelectedColor(custom); // Update selected color to custom color
    onChangeColor(custom); // Notify parent component of the color change
  };

  return (
    <Container className="color-picker-container">
      <Row className="mb-3">
        {/* Color selection dropdown */}
        <Col xl={6} style={{ paddingLeft: "0" }}>
          <FormGroup>
            <FormLabel htmlFor="color-select" className="me-2">
              Choose a color:
            </FormLabel>
            <FormControl
              as="select"
              id="color-select"
              value={selectedColor}
              onChange={handleSelectChange}
              aria-label="Color selection"
              className="form-select"
            >
            {
              customColor != "#000000" && <option>Custom</option>
            }
              {predefinedColors.map((color) => (
                <option key={color.value} value={color.value}>
                  {color.label}
                </option>
              ))}
              {/* Option for custom color */}
            </FormControl>
          </FormGroup>
        </Col>

        {/* Display selected color */}
        <Col xl={2} className="d-flex justify-content-center align-items-end">
          <div
            className="border rounded"
            style={{
              width: "100%",
              height: "60%",
              backgroundColor: selectedColor,
              margin: "0 auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <p
              className="text-white text-center m-0"
              style={{
                fontSize: "1rem",
              }}
            >
              {selectedColor}
            </p>
          </div>
        </Col>

        {/* Custom color picker */}
        <Col xl={4} className="d-flex justify-content-center align-items-end">
          <FormGroup style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <FormLabel htmlFor="color-picker" className="m-0">
              Pick a custom color:
            </FormLabel>
            <FormControl
              id="color-picker"
              type="color"
              value={customColor}
              onChange={handleColorPickerChange}
              className="form-control-color"
              style={{ cursor: "pointer" }}
              aria-label="Custom color picker"
            />
          </FormGroup>
        </Col>
      </Row>
    </Container>
  );
});

export default ColorPicker;
