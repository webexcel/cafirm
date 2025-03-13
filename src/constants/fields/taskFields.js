export const AddTimeSheetField = [
  {
    name: "client",
    label: "Client",
    placeholder: "Select Client",
    type: "dropdown",
    options: [],
    required: true,
  },

  {
    name: "service",
    label: "Service",
    placeholder: "Select Service",
    type: "dropdown",
    options: [],
    required: true,
  },
  {
    name: "task",
    label: "Task",
    placeholder: "Enter Task",
    type: "text",
    required: true,
  },
  {
    name: "employee",
    label: "Employee",
    placeholder: "Select Employee",
    type: "multiSelect",
    options: [],
    required: true,
  },
  {
    name: "description",
    label: "Description",
    placeholder: "Enter Description",
    type: "textarea",
    required: true,
  },
  {
    name: "startdate",
    label: "Date",
    placeholder: "Select Start Date",
    type: "date",
    required: true,
  },
  {
    name: "end",
    label: "Date",
    placeholder: "Select End Date",
    type: "date",
    required: true,
  },

  {
    name: "priority",
    label: "Priority",
    placeholder: "Select Priority",
    type: "dropdown",
    options: [
      { value: "Low", label: "Low" },
      { value: "Medium", label: "Medium" },
      { value: "Large", label: "Large" },
    ],
    required: true,
  },
];


export const ViewTaskField = [
  {
    name: "client",
    label: "Client",
    placeholder: "Select Client",
    type: "dropdown",
    options: [],
    required: true,
  },
  {
    name: "employee",
    label: "Employee",
    placeholder: "Select Employee",
    type: "dropdown",
    options: [],
    required: true,
  },

  {
    name: "service",
    label: "Service",
    placeholder: "Select Service",
    type: "dropdown",
    options: [],
    required: true,
  },
];