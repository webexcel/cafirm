export const TaskModalFields = [
  {
    name: "taskName",
    label: "Task Name",
    placeholder: "Enter Task Name",
    type: "text",
    required: true,
    disable: true,
    collength : 12
  },
//   {
//     name: "client",
//     label: "Client",
//     placeholder: "Select Client",
//     type: "text",
//     required: true,
//     disable: true,
//     collength : 12
//   },
//   {
//     name: "service",
//     label: "Service",
//     placeholder: "Select Service",
//     type: "text",
//     required: true,
//     disable: true,
//     collength : 12
//   },
  {
    name: "employee",
    label: "Employee",
    placeholder: "Select Employee",
    type: "multiSelect",
    options: [],
    required: true,
    disable: false,
    collength : 12
  },
  {
    name: "assignedDate",
    label: "Assigned Date",
    placeholder: "Select Date",
    type: "date",
    required: true,
    disable: false,
    collength : 6
  },
  {
    name: "targetDate",
    label: "Target Date",
    placeholder: "Select Date",
    type: "date",
    required: true,
    disable: false,
    collength : 6
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
    disable: false,
    collength : 6
  },
  {
    name: "status",
    label: "Status",
    placeholder: "Select Status",
    type: "dropdown",
    options: [
      { value: "Pending", label: "Pending" },
      { value: "InProgress", label: "InProgress" },
      { value: "Completed", label: "Completed" },
    ],
    required: true,
    disable: false,
    collength : 6
  },
];
