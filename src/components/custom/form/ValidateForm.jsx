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
        errors[field.name] = `${field.name.charAt(0).toUpperCase() + field.name.slice(1).toLowerCase()} is required!`;
      }
    }
  });

  return errors;
};



// const validateCustomForm = (data, formFields) => {
//   const errors = {};
//   formFields.forEach((field) => {
//     if (
//       field.required &&
//       (!data[field.name] || data[field.name].trim() === "")
//     ) {
//       errors[field.name] = `This field is required!`;
//     }
//   });
//   return errors;
// };

export default validateCustomForm;
