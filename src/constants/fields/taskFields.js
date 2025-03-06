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
    options: [{ value: 1, label: "Service 1"},{value: 2,label:'Service 2' }],
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
    name: "description",
    label: "Description",
    placeholder: "Enter Description",
    type: "text",
    required: true,
  },
  {
    name: "date",
    label: "Date",
    placeholder: "Select Date",
    type: "date",
    required: true,
  },

  {
    name: "start_time",
    label: "Start time",
    placeholder: "Enter Start time",
    type: "timer",
    required: true,
  },
  {
    name: "end_time",
    label: "End time",
    placeholder: "Enter End time",
    type: "timer",
    required: true,
  },
];
