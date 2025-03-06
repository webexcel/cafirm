import React, { useState, useEffect, useMemo, useRef } from "react";

const SelectableSearch = ({ data, onSearch, getUserData, listkey, keybadge }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const [activeIndex, setActiveIndex] = useState(-1);
    const dropdownRef = useRef(null);
    const listRef = useRef(null);

    const filteredResults = useMemo(() => {
        if (searchTerm) {
            const regex = new RegExp(searchTerm, "i");
            return data.filter((item) =>
                Object.values(item).some((value) =>
                    value != null && regex.test(value.toString())
                )
            );
        } else if (isFocused) {
            return data;
        } else {
            return [];
        }
    }, [searchTerm, data, isFocused]);

    useEffect(() => {
        onSearch(filteredResults);
    }, [filteredResults, onSearch]);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsFocused(false);
                setActiveIndex(-1);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
        if (filteredResults.length === 0) return;

        if (e.key === "ArrowDown") {
            setActiveIndex((prevIndex) =>
                prevIndex < filteredResults.length - 1 ? prevIndex + 1 : 0
            );
        } else if (e.key === "ArrowUp") {
            setActiveIndex((prevIndex) =>
                prevIndex > 0 ? prevIndex - 1 : filteredResults.length - 1
            );
        } else if (e.key === "Enter" && activeIndex >= 0) {
            const selectedItem = filteredResults[activeIndex];
            setSearchTerm(selectedItem.name);
            setIsFocused(false);
            setActiveIndex(-1);
        }
    };

    useEffect(() => {
        if (listRef.current) {
            const activeElement = listRef.current.querySelector(".active");
            if (activeElement) {
                const dropdownHeight = listRef.current.offsetHeight;
                const itemTop = activeElement.offsetTop;
                const itemBottom = itemTop + activeElement.offsetHeight;

                if (itemBottom > dropdownHeight) {
                    listRef.current.scrollTop = itemBottom - dropdownHeight;
                }
                else if (itemTop < 0) {
                    listRef.current.scrollTop = itemTop;
                }
            }
        }
    }, [activeIndex, filteredResults]);

    return (
        <div
            className="position-relative"
            ref={dropdownRef}
            onKeyDown={handleKeyDown}
            tabIndex="0"
        >
            <input
                type="text"
                className="form-control ps-5"
                placeholder="Search..."
                value={searchTerm || ""}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setIsFocused(true)}
                style={{
                    borderRadius: "4px",
                    height: "38px",
                    paddingRight: "30px",  // Make space for the "X" button
                }}
            />

            <i
                className="bi bi-search position-absolute"
                style={{
                    left: "5%",
                    top: "50%",
                    transform: "translateY(-50%)",
                    fontSize: "1rem",
                    color: "#6c757d",
                }}
            ></i>

            {/* Clear button */}
            {searchTerm && (
                <i
                    className="bi bi-x position-absolute"
                    style={{
                        right: "10px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontSize: "1.2rem",
                        color: "#6c757d",
                        cursor: "pointer",
                    }}
                    onClick={() => setSearchTerm("")}  // Clear the search term
                ></i>
            )}

            {isFocused && filteredResults.length > 0 && (
                <ul
                    className="list-group position-absolute w-100 mt-1 shadow-sm"
                    style={{
                        zIndex: 1000,
                        maxHeight: "300px",
                        overflowY: "auto",
                    }}
                    ref={listRef}
                >
                    {filteredResults.map((item, index) => (
                        <li
                            key={item.id || index}
                            className={`list-group-item list-group-item-action d-flex justify-content-between align-items-center ${activeIndex === index ? "active" : ""}`}
                            style={{
                                cursor: "pointer",
                                height: '40px'
                            }}
                            onClick={() => {
                                setSearchTerm(`${item?.name || item?.client_name || ''}`);
                                setIsFocused(false);
                                getUserData(item);
                                setActiveIndex(-1);
                            }}
                        >
                            <span>{item[listkey]}</span>
                            <span className="text-muted">{item[keybadge]}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SelectableSearch;
