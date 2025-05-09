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
      { value: "Critical", label: "Critical" },
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
    name: "service",
    label: "Service",
    placeholder: "Select Service",
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
    name: "priority",
    label: "Priority",
    placeholder: "Select Priority",
    type: "dropdown",
    options: [
      { value: "ALL", label: "All" },
      { value: "Low", label: "Low" },
      { value: "Medium", label: "Medium" },
      { value: "Critical", label: "Critical" },
    ],
    required: true,
  },
  {
    name: "status",
    label: "Status",
    placeholder: "Select Status",
    type: "dropdown",
    options: [
      { value: "ALL", label: "All" },
      { value: "0", label: "Pending" },
      { value: "1", label: "Inprogress" },
      { value: "2", label: "Completed" },
    ],
    required: true,
  },
];
