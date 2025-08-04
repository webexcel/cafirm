import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";

// DocumentRow Component
const DocumentRow = ({ document, level, onDelete, index, downloadFile, copyClipboard }) => (
  <tr>
    <td style={{ paddingLeft: `${level * 20}px` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', flex: 1 }}>
          <span style={{
            flex: '1 1 20%',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            whiteSpace: 'normal',
          }}>
            <i className="bi bi-file-earmark-text me-2 text-muted" />
            <strong>{document.doc_name || "Untitled"}</strong>
          </span>

          <span style={{
            flex: '1 1 40%',
            wordBreak: 'break-word',
            overflowWrap: 'break-word',
            whiteSpace: 'normal',

          }}>
            {document.description}
          </span>

          {/* <Button
            variant="link"
            className="btn btn-sm p-0"
            style={{
              flex: '1 1 35%',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              whiteSpace: 'normal',
              padding: 0,
              textAlign: 'left',
            }}
          >
            {document.doc_url}
          </Button> */}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginLeft: '10px' }}>
          <button
            type="button"
            className={`btn btn-sm d-flex align-items-center ${document.clipboard ? 'btn-success' : 'btn-secondary'}`}
            onClick={(e) => {
              e.preventDefault();
              copyClipboard(document, index);
            }}
          >
            <i
              className={`bi ${document.clipboard ? 'bi-clipboard2-check-fill' : 'bi-clipboard-check'}`}
              style={{ fontSize: "0.9rem" }}
            >{document.clipboard}</i>
          </button>
          <Button variant="primary" className="btn btn-sm" onClick={() => downloadFile(document)}>
            <i className="bi bi-download" />
          </Button>
          <Button variant="danger" className="btn btn-sm" onClick={() => onDelete(document, index)}>
            <i className="bi bi-trash" />
          </Button>
        </div>


      </div>
    </td>
  </tr>

);

// TypeRow Component
const TypeRow = ({ typeNode, level, onDelete, index, downloadFile, copyClipboard }) => {
  const [expanded, setExpanded] = useState(false);
  const hasDocuments = typeNode.documents?.length > 0;

  return (
    <>
      <tr onClick={() => setExpanded(!expanded)} style={{ cursor: 'pointer' }}>
        <td style={{ paddingLeft: `${level * 20}px` }}>
          <i className={`bi ${expanded ? 'bi bi-folder text-warning' : 'bi bi-folder text-warning'} me-1`} />
          <span>{typeNode.task_name}</span>
        </td>
      </tr>
      {expanded &&
        hasDocuments &&
        typeNode.documents.map((doc, i) => (
          <DocumentRow key={i} document={doc} level={level + 1} onDelete={onDelete} index={index} downloadFile={downloadFile} copyClipboard={copyClipboard} />
        ))}
    </>
  );
};

// ClientRow Component
const ClientRow = ({ client, onDelete, index, downloadFile, copyClipboard }) => {
  const [expanded, setExpanded] = useState(false);
  const hasTypes = client.childs?.length > 0;

  return (
    <>
      <tr onClick={() => setExpanded(!expanded)} style={{ cursor: 'pointer' }}>
        <td>
          <i className={`bi ${expanded ? 'bi bi-folder text-warning' : 'bi bi-folder text-warning'} me-1`} />
          <span>{client.client_name}</span>
        </td>
      </tr>
      {expanded &&
        hasTypes &&
        client.childs.map((type, i) => (
          <TypeRow key={i} typeNode={type} level={1} onDelete={onDelete} index={index} downloadFile={downloadFile} copyClipboard={copyClipboard} />
        ))}
    </>
  );
};

// DocumentationTreeTable Component
const DocumentationTreeTable = ({ data, onDelete, downloadFile, copyClipboard }) => {
  return (
    <Table className="table table-hover text-nowrap table-striped">
      <tbody>
        {data.map((client, index) => (
          <ClientRow key={client.id} client={client} copyClipboard={copyClipboard} onDelete={onDelete} index={index} downloadFile={downloadFile} />
        ))}
      </tbody>
    </Table>
  );
};

export default DocumentationTreeTable;
