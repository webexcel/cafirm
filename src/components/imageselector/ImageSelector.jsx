import React, { useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { convertToBase64 } from "../../utils/generalUtils";

const ImageSelector = ({ onImageSelect }) => {
  const fileInputRef = useRef(null);
  const [error, setError] = useState("");

  const handleImageChange = async (event) => {
    const file = event.target.files[0];

    if (file) {
      const maxSize = 2 * 1024 * 1024; // 2MB limit
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];

      if (file.size > maxSize) {
        setError("File size exceeds the 2MB limit. Please upload a smaller image.");
        resetFileInput();
        return;
      }

      if (!validImageTypes.includes(file.type)) {
        setError("Invalid file type. Please upload a JPEG, PNG, or GIF.");
        resetFileInput();
        return;
      }

      try {
        const base64 = await convertToBase64(file);
        if (onImageSelect) onImageSelect(base64);
        setError("");
      } catch (err) {
        setError("Failed to process the image. Please try again.");
        console.error("Image conversion error:", err);
        resetFileInput();
      }
    }
  };

  const resetFileInput = () => {
    // Reset using ref instead of direct DOM manipulation
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <Form>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Select an Image</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
        />
        {error && <div className="text-danger mt-1">{error}</div>}
      </Form.Group>
    </Form>
  );
};

export default ImageSelector;
