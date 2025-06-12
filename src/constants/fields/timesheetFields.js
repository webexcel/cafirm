export const ViewEmpTimeSheetField = [
  {
    name: "employee",
    label: "Employee",
    placeholder: "Select Employee",
    type: "searchable_dropdown",
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
    type: "searchable_dropdown",
    options: [],
    required: true,
  },
  {
    name: "service",
    label: "Service",
    placeholder: "Select Service",
    type: "searchable_dropdown",
    options: [],
    required: true,
  },
  {
    name: "employee",
    label: "Employee",
    placeholder: "Select Employee",
    type: "searchable_dropdown",
    options: [],
    required: true,
    disabled: true,
  },

     {
    name: "dates",
    label: "Date",
    placeholder: "Select Date",
    startDate: null,
    endDate: null,
    type: "daterange",
    required: true,
    disable: false,
    collength: 12,
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
  {
    name: "weekly_id",
    label: "Week ID",
    placeholder: "Select Week ID",
    type: "weeklydatepicker",
    options: [],
    required: false,
    disable: true,
    collength: 12,
  },
];
