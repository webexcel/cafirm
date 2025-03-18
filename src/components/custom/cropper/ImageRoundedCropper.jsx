
import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { Modal, Button, Form, Container, Row, Col } from 'react-bootstrap';
import getCroppedImg from './getCroppedImg';

const ImageCropper = ({ imageSrc, show, handleClose, onSave }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = useCallback((_, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);


    const handleSave = async () => {
        const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
        const reader = new FileReader();
        reader.readAsDataURL(croppedBlob);
        reader.onloadend = () => {
            const base64data = reader.result;
            console.log("Base64 Image:", base64data);
            onSave(base64data);
        };
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="md" >
            <Modal.Header closeButton>
                <Modal.Title className='fs-15'>Crop Image</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Container>
                    <Row className="justify-content-center">
                        <Col md={8} className="d-flex align-items-center justify-content-center" style={{ height: 300, position: 'relative', background: '#f8f9fa', borderRadius: '10px' }}>
                            <Cropper
                                style={{ containerStyle: { height: 300, width: 300 } }}
                                image={imageSrc}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                cropShape="round"
                                showGrid={false}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={onCropComplete}
                            />
                        </Col>
                    </Row>
                    <Row className="mt-3">
                        <Col md={12} className="text-center">
                            <Form.Label>Zoom</Form.Label>
                            <Form.Range
                                value={zoom}
                                min={1}
                                max={3}
                                step={0.1}
                                onChange={(e) => setZoom(parseFloat(e.target.value))}
                            />
                        </Col>
                    </Row>
                </Container>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-end">
                <Button variant="secondary" onClick={handleClose}>Cancel</Button>
                <Button variant="primary" onClick={handleSave}>Save</Button>
            </Modal.Footer>
        </Modal>
    )
};

export default ImageCropper;
