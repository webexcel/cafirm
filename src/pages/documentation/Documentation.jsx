import React, { Fragment, useCallback, useState, useEffect, Suspense, useRef } from "react";
import { Row, Col, Card, Toast, ToastContainer } from "react-bootstrap";
import Swal from "sweetalert2";
import CustomForm from "../../components/custom/form/CustomForm";
import useForm from "../../hooks/useForm";
import validateCustomForm from "../../components/custom/form/ValidateForm";
import { getClient } from "../../service/client_management/createClientServices";
import Loader from "../../components/common/loader/loader";
import { getServicesForTask } from "../../service/task_management/createTaskServices";
import { usePermission } from "../../contexts";
import { CreateDocumentationField } from "../../constants/fields/documentationFields";
import DocumentationTreeTable from "./DocumentationTreeTable";
import { addDocument, deleteDocument, getDocumentsService, getTasksByClient } from "../../service/document_module/documentation";
import { getDocumentType } from "../../service/masterDetails/createDocument";
import Search from "../../components/common/search/Search";
import axios from "axios";
import { getToken } from "../../utils/authUtils";
import { copyTextToClipboard } from "../../utils/generalUtils";

const Documentation = () => {
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState(tableData);
  const [formFields, setFormFields] = useState(CreateDocumentationField);
  const [clientdata, setClientData] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", bg: "success" });
  const inputRef = useRef();

  const { permissions, getOperationFlagsById } = usePermission();
  const [permissionFlags, setPermissionFlags] = useState(1);

  const initialFormState = CreateDocumentationField.reduce((acc, field) => {
    acc[field.name] = "";
    return acc;
  }, {});

  const showToast = (message, bg = "success") => {
    setToast({ show: true, message, bg });
    setTimeout(() => setToast({ ...toast, show: false }), 2500);
  };

  const { formData, errors, handleInputChange, validateForm, resetForm, setFieldValue } = useForm(
    initialFormState,
    (data) => validateCustomForm(data, CreateDocumentationField)
  );

  useEffect(() => {
    const fetchFieldOptionData = async () => {
      try {
        const clientresponse = await getClient();
        const typeresponse = await getDocumentType();
        const updatedFormFields = CreateDocumentationField.map((field) => {
          if (field.name === "client") {
            const clientOptions = clientresponse?.data?.data?.map((item) => ({
              value: item.client_id,
              label: item.client_name,
            })) || [];
            setClientData(clientOptions);
            return { ...field, options: clientOptions };
          }
          return field;
        });
        setFormFields(updatedFormFields);
      } catch (error) {
        console.error("Error fetching form options:", error);
      }
    };
    fetchFieldOptionData();
  }, []);

  const getHandlerDoc = async () => {
    try {
      const response = await getDocumentsService();

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
          return { ...child, id: childId, documents: processedDocs };
        }) || [];
        return { ...item, id: itemId, childs: processedChilds };
      });

      setTableData(processedData || []);
      setFilteredData(processedData || []);
    } catch (error) {
      console.error("Error getting document data:", error);
    }
  };

  useEffect(() => {
    getHandlerDoc();
    const permissionFlags = getOperationFlagsById(10, 1);
    setPermissionFlags(permissionFlags);
  }, []);

  useEffect(() => {
    if (formData.client) {
      const fetchTaskData = async () => {
        try {
          const response = await getTasksByClient({ client_id: formData.client });
          const updatedFormFields = formFields.map((field) => {
            if (field.name === "task") {
              const taskOptions = response?.data?.data?.map((item) => ({
                value: item.task_id,
                label: item.task_name,
              })) || [];
              return { ...field, options: taskOptions };
            }
            return field;
          });
          setFormFields(updatedFormFields);
        } catch (error) {
          console.error("Error loading services:", error);
        }
      };
      fetchTaskData();
    }
  }, [formData.client]);

  useEffect(() => {
    if (formData.service) {
      const fetchServiceData = async () => {
        try {
          const response = await getServicesForTask({ client_id: formData.client });
          const updatedFormFields = formFields.map((field) => {
            if (field.name === "service") {
              const serviceOptions = response?.data?.data?.map((item) => ({
                value: item.service_id,
                label: item.service_name,
              })) || [];
              return { ...field, options: serviceOptions };
            }
            return field;
          });
          setFormFields(updatedFormFields);
        } catch (error) {
          console.error("Error loading services:", error);
        }
      };
      fetchServiceData();
    }
  }, [formData.service]);

  const getServiceDataByClient = async () => {
    try {
      const response = await getServicesForTask({ client_id: formData.client });
      const updatedFormFields = formFields.map((field) => {
        if (field.name === "service") {
          const serviceOptions = response?.data?.data?.map((item) => ({
            value: item.service_id,
            label: item.service_name,
          })) || [];
          return { ...field, options: serviceOptions };
        }
        return field;
      });
      setFormFields(updatedFormFields);
    } catch (error) {
      console.error("Error loading services:", error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const result = await Swal.fire({
      title: "Are you sure about upload document?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, Add it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const payload = {
          client_id: formData?.client || "",
          description: formData?.description || "",
          task_id: formData?.task || "",
          doc_name: formData?.doc_name || "",
          doc_base: formData?.upload_doc || "",
        };

        const response = await addDocument(payload);

        if (!response.data.status) {
          return Swal.fire("Error", response.data.message || "Failed to add document.", "error");
        }

        Swal.fire("Success", "Document added successfully", "success");
        getHandlerDoc();
        resetForm();
      } catch (err) {
        console.error("Error while uploading document:", err);
        Swal.fire("Error", err.response?.data?.message || "Failed to add document data.", "error");
      }
    }
  };

  const onDelete = useCallback(async (updatedData, index) => {
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
          getHandlerDoc();
          Swal.fire("Deleted!", response?.data?.message || "Document deleted successfully.", "success");
        }
      } catch (error) {
        Swal.fire("Error", error.response?.data?.message || "Failed to delete document.", "error");
      }
    }
  }, []);

  const handleDownload = async (document) => {
    try {
      const token = getToken();
      const BASE_URL = import.meta.env.VITE_BASE_URL;
      const response = await axios.post(
        `${BASE_URL}/api/document/downloadDocument`,
        { document_id: document.id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const { file_base64, file_name } = response.data;
      if (file_base64 && file_name) {
        downloadBase64File(file_base64, file_name);
      }
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  const downloadBase64File = (base64Data, fileName) => {
    const arr = base64Data.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    if (!mimeMatch) return;
    const mime = mimeMatch[1];
    const bstr = atob(arr[1]);
    const u8arr = new Uint8Array(bstr.length);
    for (let i = 0; i < bstr.length; i++) u8arr[i] = bstr.charCodeAt(i);
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
    if (!targetDoc?.doc_url) {
      showToast("No URL to copy.", "danger");
      return;
    }

    copyTextToClipboard(targetDoc.doc_url)
      .then(() => {
        const updated = filteredData.map((client) => ({
          ...client,
          childs: client.childs.map((child) => ({
            ...child,
            documents: child.documents.map((doc) => ({
              ...doc,
              clipboard: doc.id === targetDoc.id,
            })),
          })),
        }));
        setFilteredData(updated);
        setTableData(updated);
        showToast("URL has been copied to clipboard.");

        setTimeout(() => {
          const reset = updated.map((client) => ({
            ...client,
            childs: client.childs.map((child) => ({
              ...child,
              documents: child.documents.map((doc) => ({
                ...doc,
                clipboard: false,
              })),
            })),
          }));
          setFilteredData(reset);
          setTableData(reset);
        }, 2500);
      })
      .catch((err) => {
        console.error("Copy failed:", err);
        showToast("Failed to copy to clipboard.", "danger");
      });
  };

  return (
    <Fragment>
      <Row>
        <Col xl={12}>
          <Card className="custom-card">
            <Card.Body>
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

      {/* ✅ Toast Notification */}
      <ToastContainer position="bottom-end" className="p-3" style={{ zIndex: 9999 }}>
        <Toast
          show={toast.show}
          onClose={() => setToast({ ...toast, show: false })}
          delay={2500}
          autohide
          bg={toast.bg}
        >
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Fragment>
  );
};

export default Documentation;
