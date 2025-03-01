import { useState } from "react";

// Custom hook for form handling
const useForm = (initialState, validate) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  // Handle input change
  const handleInputChange = (e, fieldName) => {
    console.log('eeeeeeeee', e,fieldName);
    if (Array.isArray(e)) {
      setFormData((prev) => ({
        ...prev,
        [fieldName]: e,
      }));

      if (fieldName && errors[fieldName]) {
        console.log('fieldName',errors[fieldName]);
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
