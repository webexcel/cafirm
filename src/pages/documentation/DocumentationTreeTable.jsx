import React, { useState } from "react";
import { Table, Button } from "react-bootstrap";

// DocumentRow Component
const DocumentRow = ({ document, level, onDelete,index }) => (
    <tr>
        <td style={{ paddingLeft: `${level * 20}px` }}>
            <i className="bi bi-file-earmark-text me-2 text-muted" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', flex: 1 }}>
                    <span style={{ width: '20%', wordBreak: 'break-word' }}>
                        <strong>{document.doc_name || "Untitled"}</strong>
                    </span>
                    <span style={{ width: '40%', wordBreak: 'break-word' }}>
                        {document.description}
                    </span>
                    <Button
                        variant="link"
                        className="btn btn-sm p-0"
                        style={{
                            width: '35%',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {document.doc_url}
                    </Button>
                </div>
                <div style={{ display: 'flex', gap: '5px' }}>
                    <Button variant="primary" className="btn btn-sm">
                        <i className="bi bi-download" />
                    </Button>
                    <Button variant="danger" className="btn btn-sm" onClick={() => onDelete(document,index)}>
                        <i className="bi bi-trash" />
                    </Button>
                </div>
            </div>
        </td>
    </tr>
);

// TypeRow Component
const TypeRow = ({ typeNode, level, onDelete, index }) => {
    const [expanded, setExpanded] = useState(false);
    const hasDocuments = typeNode.documents?.length > 0;

    return (
        <>
            <tr onClick={() => setExpanded(!expanded)} style={{ cursor: 'pointer' }}>
                <td style={{ paddingLeft: `${level * 20}px` }}>
                    <i className={`bi ${expanded ? 'bi-caret-down-fill' : 'bi-caret-right-fill'} me-1`} />
                    <span>{typeNode.type}</span>
                </td>
            </tr>
            {expanded &&
                hasDocuments &&
                typeNode.documents.map((doc, i) => (
                    <DocumentRow key={i} document={doc} level={level + 1} onDelete={onDelete} index={index} />
                ))}
        </>
    );
};

// ClientRow Component
const ClientRow = ({ client, onDelete, index }) => {
    const [expanded, setExpanded] = useState(false);
    const hasTypes = client.childs?.length > 0;

    return (
        <>
            <tr onClick={() => setExpanded(!expanded)} style={{ cursor: 'pointer' }}>
                <td>
                    <i className={`bi ${expanded ? 'bi-caret-down-fill' : 'bi-caret-right-fill'} me-1`} />
                    <span>{client.client_name}</span>
                </td>
            </tr>
            {expanded &&
                hasTypes &&
                client.childs.map((type, i) => (
                    <TypeRow key={i} typeNode={type} level={1} onDelete={onDelete} index={index} />
                ))}
        </>
    );
};

// DocumentationTreeTable Component
const DocumentationTreeTable = ({ data, onDelete }) => {
    return (
        <Table className="table table-hover text-nowrap table-striped">
            <tbody>
                {data.map((client, index) => (
                    <ClientRow key={client.id} client={client} onDelete={onDelete} index={index} />
                ))}
            </tbody>
        </Table>
    );
};

export default DocumentationTreeTable;
