import React from "react";
import { Form } from "react-bootstrap";
import { convertToBase64 } from "../../utils/generalUtils";

const ImageSelector = React.memo(({ onImageSelect }) => {
  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    
    if (file) {
      // Validate the file size (e.g., 2MB limit)
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes
      if (file.size > maxSize) {
        alert("File size exceeds the 2MB limit. Please upload a smaller image.");
        
        // Clear the file input if the size is too large
        event.target.value = null;
        return;
      }

      // Validate the file type (JPEG, PNG, GIF)
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validImageTypes.includes(file.type)) {
        alert("Please upload a valid image file (JPEG, PNG, GIF).");

        // Clear the file input if the type is not valid
        event.target.value = null;
        return;
      }

      // Convert image to Base64
      const base64 = await convertToBase64(file);

      // Pass the Base64 string to the parent component
      if (onImageSelect) {
        onImageSelect(base64);
      }
    }
  };

  return (
    <Form>
      <Form.Group controlId="formFile" className="mb-3">
        <Form.Label>Select an Image</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </Form.Group>
    </Form>
  );
});

export default ImageSelector;
