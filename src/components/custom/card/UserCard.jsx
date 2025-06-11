import React, { useState, useRef, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { FaCheck, FaTimes, FaCalendarAlt, FaCamera } from "react-icons/fa";
import Select from "react-select";
import DatePicker from "react-datepicker";
import userProfile from '../../../assets/images/brand-logos/desktop-logo.png';
import { formatDate } from "../../../utils/generalUtils";
import ImageRoundedCropper from '../../custom/cropper/ImageRoundedCropper';

const UserCard = ({ userData, onFieldUpdate, fields = [] }) => {
    const [editingField, setEditingField] = useState(null);
    const [profileImage, setProfileImage] = useState(userProfile);
    const [data, setData] = useState(userData);
    const [tempValue, setTempValue] = useState("");
    const containerRef = useRef(null);
    const fileInputRef = useRef(null);
    const [showModal, setShowModal] = useState(false);
    const isUserDataEmpty = !userData || Object.values(userData).every(value => !value);

    useEffect(() => {
        setData(userData);
    }, [userData]);

    const handleEditClick = (field) => {
        setEditingField(field);
        setTempValue(data[field] || "");
    };

    const handleChange = (e) => {
        setTempValue(e.target.value);
    };

    const handleSelectChange = (e) => {
        const formattedDate = formatDate(e);
        setTempValue(formattedDate);
    };

    const handleSave = () => {
        if (onFieldUpdate) {
            onFieldUpdate(editingField, tempValue, data);
        }
        setEditingField(null);
    };

    const handleCancel = () => {
        setTempValue(data[editingField] || "");
        setEditingField(null);
    };

    const handlerGenderChange = (selectedOption, key) => {
        setData(prev => ({
            ...prev,
            [key]: selectedOption.value
        }));
    };

    const handleClickOutside = (event) => {
        if (containerRef.current && !containerRef.current.contains(event.target)) {
            setEditingField(null);
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleProfileClick = () => {
        fileInputRef.current.click();
    };

    const handleProfileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileImage(e.target.result);
            };
            reader.readAsDataURL(file);
            setShowModal(true);
        }
    };

    const onSave = (Image) => {
        onFieldUpdate("photo", Image, data);
        setShowModal(false);
    };

    return (
        <div style={{ cursor: "pointer" }} ref={containerRef}>
            {fields.map((item) =>
                item.key === "photo" ? (
                    <div className="d-flex align-items-center mb-3" key={item.key}>
                        <div className="position-relative" style={{ cursor: isUserDataEmpty ? 'default' : 'pointer' }}>
                            <img
                                src={data?.photo}
                                alt={"Profile"}
                                className="rounded-circle"
                                width="65"
                                height="65"
                                onClick={!isUserDataEmpty ? handleProfileClick : undefined}
                                style={{ opacity: data?.photo ? 0.8 : 1, transition: 'opacity 0.3s' }}
                                onMouseEnter={(e) => data?.photo && (e.target.style.opacity = 0.5)}
                                onMouseLeave={(e) => data?.photo && (e.target.style.opacity = 0.8)}
                            />
                            {!data?.photo && (
                                <FaCamera
                                    className="position-absolute top-50 start-50 translate-middle text-white cursor-pointer"
                                    style={{ fontSize: '20px', opacity: 0.7 }}
                                    onClick={!isUserDataEmpty ? handleProfileClick : undefined}
                                />
                            )}
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                accept="image/*"
                                disabled={isUserDataEmpty}
                                onChange={!isUserDataEmpty ? handleProfileChange : undefined}
                            />
                            <ImageRoundedCropper
                                imageSrc={profileImage}
                                show={showModal}
                                handleClose={() => setShowModal(false)}
                                onSave={onSave}
                            />
                        </div>
                    </div>
                ) : null
            )}

            {fields.map(({ key, label, options, type }, index) =>
                key !== "photo" ? (
                    <div
                        key={`${key}-${index}`}
                        className="d-flex justify-content-between align-items-center py-3 px-2"
                        style={{
                            borderBottom: "1px solid rgb(242 242 242)",
                            backgroundColor: index % 2 !== 0 ? "rgb(242 242 242)" : "white"
                        }}
                    >
                        <span className="text-muted" style={{ fontSize: "0.9rem", width: '35%' }}>
                            {label || key.replace(/([a-z])([A-Z])/g, "$1 $2")}
                        </span>

                        {editingField === key && key !== "employee_id" ? (
                            <div className="d-flex align-items-center" style={{ width: '65%' }}>
                                {type.toLowerCase() === "list" ? (
                                    <Select
                                        name={key}
                                        options={data[key] === "1" ? [{ label: "Super Admin", value: '1' }, ...options] : options || []}
                                        value={String(data[key]) === "1" ? "Super Admin" :
                                            options.find(option => String(option.value) === String(data[key])) || null}
                                        id={key}
                                        className="w-100"
                                        menuPlacement="auto"
                                        classNamePrefix="Select2"
                                        placeholder="Select Role"
                                        onChange={(e) => handlerGenderChange(e, key)}
                                    />
                                ) : type.toLowerCase() === "date" ? (
                                    <DatePicker
                                        selected={tempValue}
                                        onChange={handleSelectChange}
                                        placeholderText="Select date"
                                        className="form-control"
                                    />
                                ) : (
                                    <Form.Control
                                        type={type}
                                        name={key}
                                        value={tempValue}
                                        onChange={handleChange}
                                        size="sm"
                                        className="w-100"
                                    />
                                )}
                                <Button variant="success" size="sm" onClick={handleSave} className="ms-1">
                                    <FaCheck />
                                </Button>
                                <Button variant="danger" size="sm" onClick={handleCancel} className="ms-1">
                                    <FaTimes />
                                </Button>
                            </div>
                        ) : (
                            <div
                                onClick={() => key !== "employee_id" && handleEditClick(key)}
                                style={{
                                    cursor: key !== "employee_id" ? "pointer" : "not-allowed",
                                    maxWidth: "65%"
                                }}
                            >
                                <span className="fw-normal">
                                    {type.toLowerCase() === "list"
                                        ? String(data[key]) === "1" ? "Super Admin" : options.find(option => String(option.value) === String(data[key]))?.label || "Empty"
                                        : type.toLowerCase() === "date"
                                            ? formatDate(data[key])
                                            : data[key] || "Empty"}
                                </span>
                            </div>
                        )}
                    </div>
                ) : null
            )}
        </div>
    );
};

export default UserCard;
