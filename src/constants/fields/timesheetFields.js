export const ViewEmpTimeSheetField = [
  {
    name: "employee",
    label: "Employee",
    placeholder: "Select Employee",
    type: "dropdown",
    options: [],
    required: true,
    disabled: true,
  },
  {
    name: "task",
    label: "Task",
    placeholder: "Select Task",
    type: "searchable_dropdown",
    options: [],
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
    name: "time",
    label: "Time",
    placeholder: "Enter time",
    type: "timer",
    required: true,
  },
];

export const ViewCliTimeSheetField = [
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
    disabled:true
  },

  {
    name: "start_date",
    label: "Date",
    placeholder: "Select Start Date",
    type: "date",
    required: true,
  },
  {
    name: "end_date",
    label: "Date",
    placeholder: "Select End date",
    type: "date",
    required: true,
  },
];

export const WeeklyTimeSheetField = [

  {
    name: "employee",
    label: "Employee",
    placeholder: "Select Employee",
    type: "dropdown",
    options: [],
    required: true,
    // disabled:true
  },

];