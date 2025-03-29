export const CafirmUserMenuField = [
    {
      name: "permission_name",
      label: "Permission Name",
      placeholder: "Enter Permission Name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      placeholder: "Enter Description",
      type: "text",
      required: true,
    },
  ];

  export const AssignUserFields = [
    {
      name: "employee",
      label: "Employee",
      placeholder: "Select Employee",
      type: "dropdown",
      options: [],
      required: false,
      
    },
    {
      name: "permissions",
      label: "Permissions",
      placeholder: "Select Permissions",
      type: "dropdown",
      options: [],
      required: false,
      
    },
  ];