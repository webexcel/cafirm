import { useState } from "react";
import { convertToBase64 } from "../utils/generalUtils";
// Custom hook for form handling
const useForm = (initialState, validate) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  // Handle input change
  const handleInputChange = async (e, fieldName) => {
    console.log('eeeeeeeee', e, fieldName);
    if (fieldName === 'upload_doc') {
      const file = e.target.files[0];
      const base64 = await convertToBase64(file);
      console.log("base64 :", file.name)
      setFormData((prev) => ({
        ...prev,
        [fieldName]: base64,
        doc_name: file.name
      }))
      return;
    }

    if (fieldName === "year_id") {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: e
      }))
      return;
    }

    if (fieldName === "monthly_id") {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: e
      }))
      return;
    }

    if (fieldName === "weekly_id") {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: e
      }))
      return;
    }

    if (String(fieldName) === "dates") {
      console.log("formdata eeeeeeeeeeeeeeeeeeee", formData, e.target.value)
      setFormData((prev) => ({
        ...prev,
        [fieldName]: e.target.value.map(data => new Date(data).toISOString().split('T')[0]).join('/'),
      }));

      return;
    }

    if (Array.isArray(e)) {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: e,
      }));

      if (fieldName && errors[fieldName]) {
        console.log('fieldName', errors[fieldName]);
        setErrors((prev) => ({
          ...prev,
          [fieldName]: undefined,
        }));
      }

      return;
    }

    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for the specific field
    if (fieldName && errors[fieldName]) {
      setErrors((prev) => ({
        ...prev,
        [fieldName]: undefined,
      }));
    }
    return 1;
  };

  const setFieldValue = (key, value) => {
    console.log("key value: ", key, value)
    setFormData((prev) => ({
      ...prev,
      [key]: value
    }))
  }


  const validateFormSubmission = () => {
    const validationErrors = validate(formData);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // Reset form
  const resetForm = () => {
    setFormData(initialState);
    setErrors({});
  };

  return {
    formData,
    errors,
    handleInputChange,
    validateForm: validateFormSubmission,
    resetForm,
    setFieldValue
  };
};

export default useForm;
