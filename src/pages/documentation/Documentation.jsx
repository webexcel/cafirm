
import React, { Fragment, useCallback, useState, useEffect, Suspense, useRef } from "react";
import { Row, Col, Card } from "react-bootstrap";
import Swal from "sweetalert2";
import CustomForm from "../../components/custom/form/CustomForm";
import useForm from "../../hooks/useForm";
import validateCustomForm from "../../components/custom/form/ValidateForm";
import { getClient } from "../../service/client_management/createClientServices";
import { getEmployee } from "../../service/employee_management/createEmployeeService";
import { getService } from "../../service/masterDetails/serviceApi";
import CustomTable from "../../components/custom/table/CustomTable";
import Loader from "../../components/common/loader/loader";
import { addTask, deleteTaskData, getServicesForTask, getTasksByPriority } from "../../service/task_management/createTaskServices";
import { usePermission } from "../../contexts";
import { CreateDocumentationField } from "../../constants/fields/documentationFields";
import DocumentationTreeTable from "./DocumentationTreeTable";
import { addDocument, deleteDocument, getDocumentsService } from "../../service/document_module/documentation";
import { getDocumentType } from "../../service/masterDetails/createDocument";
import Search from "../../components/common/search/Search";
import axios from "axios";
import { getToken } from "../../utils/authUtils";
import { copyTextToClipboard } from "../../utils/generalUtils";


const Documentation = () => {
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState(tableData);
  const [formFields, setFormFields] = useState(CreateDocumentationField);
  const [clientdata, setClientData] = useState([])
  const [servicedata, setServiceData] = useState([])

  const columns = [
    { header: "S No", accessor: "sno", editable: false },
    { header: "Task", accessor: "task_name", editable: false },
    // { header: "Client", accessor: "client_name", editable: false },
    { header: "Employee", accessor: "assigned_to", editable: false },
    { header: "Service", accessor: "service_name", editable: true },
    { header: "Total Minutes", accessor: "total_minutes", editable: true },
    { header: "Status", accessor: "status_name", editable: true },
    { header: "Priority", accessor: "priority", editable: true },
    { header: "Actions", accessor: "Actions", editable: false },
  ];
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(15);
  const { permissions, getOperationFlagsById } = usePermission();
  const [permissionFlags, setPermissionFlags] = useState(1);
  // Initialize form state from field definitions
  const initialFormState = CreateDocumentationField.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {});
  const inputRef = useRef()
  const { formData, errors, handleInputChange, validateForm, resetForm, setFieldValue } = useForm(
    initialFormState,
    (data) => validateCustomForm(data, CreateDocumentationField)
  );

  useEffect(() => {
    // Fetch field option data
    const fetchFieldOptionData = async () => {
      try {
        const clientresponse = await getClient();
        const typeresponse = await getDocumentType();
        console.log("Client API Response:", clientresponse);
        console.log("Documnet API Response:", typeresponse);
        const updatedFormFields = CreateDocumentationField.map((field) => {
          if (field.name === "client") {
            if (Array.isArray(clientresponse.data.data) && clientresponse.data.data.length > 0) {
              const clientOptions = clientresponse.data.data.map((item) => ({
                value: item.client_id,
                label: item.client_name,
              }));
              // console.log("Mapped Client Options:", clientOptions);
              setClientData(clientOptions)
              return { ...field, options: clientOptions };

            } else {
              console.error("Client data response is not an array or is empty.");
            }

          }
          if (field.name === "type") {
            if (Array.isArray(typeresponse.data.data) && typeresponse.data.data.length > 0) {
              const typeOptions = typeresponse.data.data.map((item) => ({
                value: item.id,
                label: item.type_name,
              }));
              console.log("Mapped Document Options:", typeOptions);
              setClientData(typeOptions)
              return { ...field, options: typeOptions };

            } else {
              console.error("Document data response is not an array or is empty.");
            }

          }
          return field;
        });
        setFormFields(updatedFormFields);
      } catch (error) {
        console.error("Error fetching class data:", error);
      }
    };
    fetchFieldOptionData()
  }, []);

  const getHandlerDoc = async () => {
    try {
      const response = await getDocumentsService();
      console.log("Document data:", response);

      let childIdCounter = 1;
      let docIdCounter = 1;

      const processedData = response?.data?.data?.map((item, itemIndex) => {
        const itemId = `item-${itemIndex + 1}`;

        const processedChilds = item.childs?.map((child) => {
          const childId = `child-${childIdCounter++}`;

          const processedDocs = child.documents?.map((doc) => ({
            ...doc,
            id: `doc-${docIdCounter++}`,
            clipboard: false,
          })) || [];

          return {
            ...child,
            id: childId,
            documents: processedDocs,
          };
        }) || [];

        return {
          ...item,
          id: itemId,
          childs: processedChilds,
        };
      });

      console.log("Processed Data with IDs:", processedData);
      setTableData(processedData || []);
      setFilteredData(processedData || []);
    } catch (error) {
      console.error("Error occurred while getting document data:", error.stack);
    }
  };

  useEffect(() => {
    getHandlerDoc()
    const permissionFlags = getOperationFlagsById(10, 1); // paren_id , sub_menu id
    console.log(permissionFlags, '---permissionFlags');
    setPermissionFlags(permissionFlags);
  }, [])

  useEffect(() => {
    if (formData.client) {
      formData.task = ""
      setFieldValue("service", "");
      const fetchClientOptionData = async () => {
        try {
          const clientresponse = await getClient();

          const client = clientresponse.data.data.find(
            (element) => Number(formData.client) === Number(element.client_id)
          );

          if (client) {
            setFieldValue("task", `${client.display_name || ''}-${formData.task}`);
            getServiceDataByClient()
          }

          console.log("form data:", formData, formFields, clientdata);
        } catch (error) {
          console.error("Error fetching client data:", error);
        }
      };

      fetchClientOptionData();
    }

  }, [formData.client]);


  useEffect(() => {
    if (formData.service) {

      const fetchClientOptionData = async () => {
        try {
          const serviceresponse = await getService()

          const service = serviceresponse.data.data.find(
            (element) => Number(formData.service) === Number(element.service_id)
          );

          if (service) {
            const taskValidation = formData.task.split("-")
            if (taskValidation.length > 1) {
              const taskval = taskValidation[0]
              setFieldValue("task", `${taskval}-${service.service_short_name}`);
              console.log("taskval", taskval, "taskValidation", taskValidation)
              return;
            }
            setFieldValue("task", `${formData.task}${service.service_name}`);
          }

          console.log("form data:", formData, formFields, clientdata);
        } catch (error) {
          console.error("Error fetching client data:", error);
        }
      };

      fetchClientOptionData();
    }
  }, [formData.service]);

  const getServiceDataByClient = async () => {
    try {
      const response = await getServicesForTask({ client_id: formData.client });
      const updatedFormFields = formFields.map((field) => {
        if (field.name === "service") {
          if (Array.isArray(response.data.data) && response.data.data.length > 0) {
            const serviceOptions = response.data.data.map((item) => ({
              value: item.service_id,
              label: item.service_name,
            }));
            // console.log("Mapped Client Options:", serviceOptions);
            // setServiceData(serviceOptions)
            return { ...field, options: serviceOptions };
          } else {
            const serviceOptions = response.data.data.map((item) => ({
              value: item.service_id,
              label: item.service_name,
            }));
            console.error("Service data response is not an array or is empty.");
            return { ...field, options: serviceOptions || [] };
          }
        }
        return field;
      });
      setFormFields(updatedFormFields);

    }
    catch (error) {
      console.log("Error Occures while getting services by client : ", error.stack)
    }
  }

  // Handle add
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const result = await Swal.fire({
      title: "Are you sure about upload document ?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Add it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });
    if (result.isConfirmed) {
      try {
        console.log("Selected form:", formData);

        const payload = {
          "client_id": formData?.client || "",
          "description": formData?.description || "",
          "type_id": formData?.type || "",
          "doc_name": formData?.doc_name || "",
          "doc_base": formData?.upload_doc || "",
        }
        const response = await addDocument(payload);
        if (!response.data.status) {
          return Swal.fire("Error", response.data.message || "Failed to add document.", "error");
        }
        Swal.fire("Success", `Document added successfully`, "success");
        getHandlerDoc()
        resetForm()

      } catch (err) {
        console.error("Error while get document data:", err.stack);
        Swal.fire("Error", err.response?.data?.message || "Failed to add document data.", "error");
      }
    }

  };

  const onDelete = useCallback(async (updatedData, index) => {
    console.log("update dataaa", updatedData, index);

    const result = await Swal.fire({
      title: "Are you sure you want to delete document?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const payload = { document_id: updatedData?.id };
        const response = await deleteDocument(payload);

        if (response.data.status) {
          // Use functional state updates to get the latest data
          // setFilteredData((prevFilteredData) =>
          //   prevFilteredData
          //     .filter((item, ind) => ind !== index) // Remove the item
          //     .map((item, ind) => ({ ...item, sno: ind + 1 })) // Re-index
          // );

          // setTableData((prevTableData) =>
          //   prevTableData
          //     .filter((item, ind) => ind !== index)
          //     .map((item, ind) => ({ ...item, sno: ind + 1 }))
          // );
          getHandlerDoc()
          Swal.fire("Deleted!", response?.data?.message || "Documnet deleted successfully.", "success");
        }
      } catch (error) {
        Swal.fire("Error", error.response?.data?.message || "Failed to delete doc.", "error");
      }
    }
  }, []);

  const handleDownload = async (document) => {
    try {
      const token = getToken();
      const BASE_URL = import.meta.env.VITE_BASE_URL;
      const PORT = import.meta.env.VITE_PORT;
      const response = await axios.post(
        `${BASE_URL}/api/document/downloadDocument`,
        { document_id: document.id },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
        }
      );

      const { file_base64, file_name } = response.data;

      if (file_base64 && file_name) {
        downloadBase64File(file_base64, file_name);
      } else {
        console.error("Missing file data or file name in response.");
      }
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const downloadBase64File = (base64Data, fileName) => {
    const arr = base64Data.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);

    if (!mimeMatch) {
      console.error("Could not extract MIME type.");
      return;
    }

    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    const blob = new Blob([u8arr], { type: mime });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName || "downloaded-file";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const copyClipboard = (targetDoc) => {
    console.log("Copy target document: ", targetDoc);

    if (!targetDoc?.doc_url) {
      Swal.fire("Error", "No URL to copy.", "error");
      return;
    }

    copyTextToClipboard(targetDoc.doc_url)
      .then(() => {
        // Set clipboard true for only the copied document
        const updated = filteredData.map(client => ({
          ...client,
          childs: client.childs.map(child => ({
            ...child,
            documents: child.documents.map(doc => ({
              ...doc,
              clipboard: doc.id === targetDoc.id, // Set true only for matched doc
            }))
          }))
        }));

        setFilteredData(updated);
        setTableData(updated);

        Swal.fire("Copied!", "URL has been copied to clipboard.", "success");

        // Reset clipboard flag after 2.5 seconds
        setTimeout(() => {
          const reset = updated.map(client => ({
            ...client,
            childs: client.childs.map(child => ({
              ...child,
              documents: child.documents.map(doc => ({
                ...doc,
                clipboard: false
              }))
            }))
          }));

          setFilteredData(reset);
          setTableData(reset);
        }, 2500);
      })
      .catch((err) => {
        console.error("Copy failed: ", err);
        Swal.fire("Error", "Failed to copy to clipboard.", "error");
      });
  };


  return (
    <Fragment>
      <Row>
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Body>
              <Col xl={12}>
                <CustomForm
                  formFields={formFields}
                  formData={formData}
                  errors={errors}
                  onChange={handleInputChange}
                  onSubmit={handleAdd}
                  showAddButton={true}
                  showUpdateButton={true}
                  inputRef={inputRef}
                />

              </Col>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xl={12}>
          <Card className="custom-card p-3">
            <Card.Header>
              <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
                <Card.Title>Documentation  </Card.Title>
                <div style={{ width: '30%' }}>
                  <Search list={tableData} onSearch={(result) => setFilteredData(result)} />
                </div>
              </div>
            </Card.Header>
            <Card.Body className="overflow-auto">
              <Suspense fallback={<Loader />}>
                <DocumentationTreeTable
                  data={filteredData}
                  onDelete={onDelete}
                  downloadFile={handleDownload}
                  copyClipboard={copyClipboard}
                />
              </Suspense>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Fragment>
  );
};

export default Documentation;
