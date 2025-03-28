export const WorkTimesheetFields = [
  {
    name: "employee",
    label: "Employee",
    placeholder: "Select Employee",
    type: "dropdown",
    options: [],
    required: false,
    disable: false,
    collength: 12,
    
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

export const ActivityTrackerFields = [
  {
    name: "date",
    label: "Date",
    placeholder: "Select Date",
    type: "date",
    required: true,
  },
];
