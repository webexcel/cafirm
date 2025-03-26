import React, { useState, useRef, useEffect } from "react";
import { Button, Form } from "react-bootstrap";
import { FaCheck, FaTimes } from "react-icons/fa";
import userProfile from '../../../assets/images/brand-logos/desktop-logo.png';
import Select from "react-select";
import { FaCalendarAlt } from "react-icons/fa";
import DatePicker from "react-datepicker";
import { formatDate } from "../../../utils/generalUtils";
import { FaUserCheck, FaCamera } from "react-icons/fa";
import ImageRoundedCropper from '../../custom/cropper/ImageRoundedCropper'

const UserCard = ({
    userData,
    onFieldUpdate,
    fields = []
}) => {
    const [editingField, setEditingField] = useState(null);
    const [profileImage, setProfileImage] = useState(userProfile)
    const [tempValue, setTempValue] = useState("");
    const containerRef = useRef(null);
    const fileInputRef = useRef(null);
    const [showModal, setShowModal] = useState(false);

    const Gender = [
        { label: 'Boy', value: 'Boy' },
        { label: 'Girl', value: 'Girl' },
    ];
    const gender = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
    ];

    const handleEditClick = (field) => {
        setEditingField(field);
        setTempValue(userData[field] || "");
    };

    const handleChange = (e) => {
        console.log("testttt", e.target.value)
        setTempValue(e.target.value);
    };

    const handleSelectChange = (e) => {
        console.log("testttt111", e)
        const month = String(e.getMonth() + 1).padStart(2, "0");
        const day = String(e.getDate()).padStart(2, "0");
        const year = e.getFullYear();
        console.log("monthh", `${month}/${day}/${year}`)
        setTempValue(`${month}/${day}/${year}`);
    };

    const handleSave = () => {
        if (onFieldUpdate) {
            onFieldUpdate(editingField, tempValue, userData);
        }
        console.log("fielddd", editingField, tempValue)
        setEditingField(null);
    };

    const handleCancel = () => {
        setTempValue(userData[editingField] || "");
        setEditingField(null);
    };

    const handlerGenderChange = (selectedOption) => {
        console.log("gender", selectedOption);
        setTempValue(selectedOption.value);
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
        // if (!userData?.photo) {
        fileInputRef.current.click()
        // }
    };

    const handleProfileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfileImage(e.target.result);
            };
            reader.readAsDataURL(file);
            setShowModal(true)
        }
    };

    const onSave = (Image) => {
        onFieldUpdate("photo", Image, userData)
        // console.log("Save value", Image)
        setShowModal(false)
    }

    return (
        <div style={{ cursor: "pointer" }} ref={containerRef}>

            <div>

                {
                    fields.map((item) => {
                        return (
                            item.key === "photo" && (
                                <div className="d-flex align-items-center mb-3">

                                    <div className="position-relative" style={{ cursor: userData?.photo ? 'pointer' : 'default' }}>
                                        <img
                                            src={userData?.photo || profileImage}
                                            alt={"Profile image"}
                                            className="rounded-circle"
                                            width="65"
                                            height="65"
                                            onClick={handleProfileClick}
                                            style={{ opacity: userData?.photo ? 0.8 : 1, transition: 'opacity 0.3s' }}
                                            onMouseEnter={(e) => userData?.photo && (e.target.style.opacity = 0.5)}
                                            onMouseLeave={(e) => userData?.photo && (e.target.style.opacity = 0.8)}
                                        />
                                        {!userData?.photo && (
                                            <FaCamera
                                                className="position-absolute top-50 start-50 translate-middle text-white cursor-pointer"
                                                style={{ fontSize: '20px', opacity: 0.7 }}
                                                onClick={handleProfileClick}
                                            />
                                        )}
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            style={{ display: 'none' }}
                                            accept="image/*"
                                            onChange={handleProfileChange}
                                        />
                                        <ImageRoundedCropper
                                            imageSrc={profileImage}
                                            show={showModal}
                                            handleClose={() => setShowModal(false)}
                                            onSave={onSave}
                                        />
                                    </div>

                                </div>
                            )
                        );
                    })
                }

                {fields.map(({ key, label }, index) => (
                    label !== "photo" ? (
                        <div
                            key={`${key}-${index}`}
                            ref={containerRef}
                            className="d-flex justify-content-between align-items-center py-3 px-2 user-selectable-card"
                            style={{
                                borderBottom: "1px solid rgb(242 242 242)",
                                backgroundColor: index % 2 !== 0 ? "rgb(242 242 242)" : "white" // Apply background to odd rows
                            }}
                        >
                            <span
                                className="text-muted"
                                ref={containerRef}
                                style={{ fontSize: "0.9rem" }}
                            >
                                {label || key.replace(/([a-z])([A-Z])/g, "$1 $2")}
                            </span>

                            {["ADMISSION_ID", "CLASSSEC", "staff_code"].includes(key) ? (
                                <div style={{ maxWidth: "65%" }}>
                                    <span className={`${["ADMISSION_ID", "staff_code"].includes(key) ? "fw-semibold" : "fw-normal"}`}>
                                        {userData[key] || "Empty"}
                                    </span>
                                </div>
                            ) : editingField === key && !["employee_id", "client_id"].includes(key) ? (
                                <div className="d-flex align-items-center justify-content-end">
                                    {(() => {
                                        switch (key.toLowerCase()) {
                                            case "gender":
                                                return (
                                                    <>
                                                        <div style={{ position: "relative", display: "inline-block" }}>
                                                            <Select
                                                                name={key}
                                                                options={gender}
                                                                id={key}
                                                                className="w-100 js-example-placeholder-single js-states"
                                                                menuPlacement="auto"
                                                                classNamePrefix="Select2"
                                                                placeholder="Select gender"
                                                                onChange={handlerGenderChange}
                                                            />
                                                        </div>
                                                        <Button
                                                            variant="success"
                                                            size="sm"
                                                            onClick={handleSave}
                                                            className="ms-1"
                                                        >
                                                            <FaCheck />
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={handleCancel}
                                                            className="ms-1"
                                                        >
                                                            <FaTimes />
                                                        </Button>
                                                    </>
                                                );
                                            case "dob":
                                                return (
                                                    <>
                                                        <div style={{ position: "relative", display: "inline-block", width: "75%" }}>
                                                            <DatePicker
                                                                selected={tempValue}
                                                                onChange={handleSelectChange}
                                                                placeholderText="Select date"
                                                                className="form-control"
                                                                style={{ paddingRight: "2rem" }}
                                                            />
                                                            <FaCalendarAlt
                                                                style={{
                                                                    position: "absolute",
                                                                    right: "10px",
                                                                    top: "50%",
                                                                    transform: "translateY(-50%)",
                                                                    pointerEvents: "none",
                                                                    color: "#6c757d",
                                                                }}
                                                            />
                                                        </div>
                                                        <Button
                                                            variant="success"
                                                            size="sm"
                                                            onClick={handleSave}
                                                            className="ms-1"
                                                        >
                                                            <FaCheck />
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={handleCancel}
                                                            className="ms-1"
                                                        >
                                                            <FaTimes />
                                                        </Button>
                                                    </>
                                                );
                                            default:
                                                return (
                                                    <>
                                                        <Form.Control
                                                            type="text"
                                                            name={key}
                                                            value={tempValue}
                                                            onChange={handleChange}
                                                            size="sm"
                                                            className="w-100"
                                                        />
                                                        <Button
                                                            variant="success"
                                                            size="sm"
                                                            onClick={handleSave}
                                                            className="ms-1"
                                                        >
                                                            <FaCheck />
                                                        </Button>
                                                        <Button
                                                            variant="danger"
                                                            size="sm"
                                                            onClick={handleCancel}
                                                            className="ms-1"
                                                        >
                                                            <FaTimes />
                                                        </Button>
                                                    </>
                                                );
                                        }
                                    })()}
                                </div>
                            ) : (
                                <div
                                    onClick={() =>
                                        userData &&
                                        typeof userData === "object" &&
                                        Object.keys(userData).length > 1 &&
                                        handleEditClick(key)
                                    }
                                    style={{ cursor: "pointer", maxWidth: "65%" }}
                                >
                                    <span className="fw-normal">
                                        {key.toLowerCase() === "dob" ? formatDate(userData[key]) : userData[key] || "Empty"}
                                    </span>
                                </div>
                            )}
                        </div>
                    ) : null
                ))}


            </div>
        </div>
    );
};

export default UserCard;
