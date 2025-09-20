export const CreateDocumentationField = [
  {
    name: "client",
    label: "Client",
    placeholder: "Select Client",
    type: "searchable_dropdown",
    options: [],
    required: true,
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
    name: "description",
    label: "Description",
    placeholder: "Enter Description",
    type: "textarea",
    required: true,
  },
  {
    name: "upload_doc",
    label: "Upload",
    placeholder: "Enter Upload",
    type: "file",
    required: true,
  },
];
