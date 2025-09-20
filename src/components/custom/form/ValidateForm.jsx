const validateCustomForm = (data, formFields) => {
  const errors = {};

  formFields.forEach((field) => {
    const fieldValue = data[field.name];

    if (field.required) {
      if (
        fieldValue === undefined ||
        fieldValue === null ||
        (typeof fieldValue === "string" && fieldValue.trim() === "") ||
        (Array.isArray(fieldValue) && fieldValue.length === 0) ||
        (typeof fieldValue === "object" && !Array.isArray(fieldValue) && !fieldValue.value)
      ) {
        errors[field.name] = `${field.label.charAt(0).toUpperCase() + field.label.slice(1).toLowerCase()} is required!`;
      }
    }
  });

  // Check that end date is not before start date
  if (data.startdate && data.end) {
    const start = new Date(data.startdate);
    const end = new Date(data.end);
    if (end < start) {
      errors.end = "End date cannot be before start date!";
    }
  }

  return errors;
};

export default validateCustomForm;
