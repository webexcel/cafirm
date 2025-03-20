export const AddClientsField = [
  {
    name: "name",
    label: "Name",
    placeholder: "Enter Full Name",
    type: "text",
    required: true,
  },

  {
    name: "displayname",
    label: "Display Name",
    placeholder: "Enter Display Name",
    type: "text",
    required: true,
  },

  {
    name: "clientType",
    label: "Client Type",
    placeholder: "Select Client Type",
    type: "dropdown",
    options: [
      { label: "Business", value: "business" },
      { label: "Individual", value: "individual" },
    ],
    required: true,
  },

  {
    name: "contactPerson",
    label: "Contact Person",
    placeholder: "Enter Contact Person",
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
    maxLength: 10,
  },

  {
    name: "address",
    label: "Address",
    placeholder: "Enter Address",
    type: "textarea",
    required: true,
  },
  {
    name: "city",
    label: "City",
    placeholder: "Enter City",
    type: "text",
    required: true,
    
  },
  {
    name: "state",
    label: "State",
    placeholder: "Enter State",
    type: "text",
    required: true,
  },
  {
    name: "country",
    label: "Country",
    placeholder: "Enter Country",
    type: "text",
    required: true,
  },
  {
    name: "pincode",
    label: "Pincode",
    placeholder: "Enter Pincode",
    type: "text",
    required: true,
  },
  {
    name: "gst_number",
    label: "GSTIN",
    placeholder: "Enter GSTIN",
    type: "text",
    required: true,
    maxLength: 15,
  },

  {
    name: "pan_number",
    label: "Pan Number",
    placeholder: "Enter Pan Number",
    type: "text",
    required: true,
    maxLength: 10,
  },

  {
    name: "tan_num",
    label: "Tan Number",
    placeholder: "Enter Tan Number",
    type: "text",
    required: true,
    maxLength: 10,
  },
];

export const AddServiceField = [
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
];
