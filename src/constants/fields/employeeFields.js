export const AddEmployeeField = [
  {
    name: "name",
    label: "Name",
    placeholder: "Enter Name",
    type: "text",
    required: true,
  },

  {
    name: "email",
    label: "Email",
    placeholder: "Enter Email",
    type: "email",
    required: true,
  },

  {
    name: "phone",
    label: "Phone",
    placeholder: "Enter Phone No",
    type: "number",
    required: true,
  },
  {
    name: "emprole",
    label: "Employee Role",
    placeholder: "Select Employee Role",
    type: "dropdown",
    options: [],
    required: true,
  },
];

export const CreateUserAccountFields = [
  {
    name: "employee",
    label: "Employee",
    placeholder: "Select Employee",
    type: "dropdown",
    options: [],
    required: true,
  },

  {
    name: "password",
    label: "Password",
    placeholder: "Enter Password",
    type: "text",
    required: true,
  },
];
