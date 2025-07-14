import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    });
};

const getTimeDifferenceInMinutes = (startTime, endTime) => {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    const startDate = new Date();
    startDate.setHours(startHours, startMinutes, 0);

    const endDate = new Date();
    endDate.setHours(endHours, endMinutes, 0);

    let diffMs = endDate - startDate;

    if (diffMs < 0) {
        diffMs += 24 * 60 * 60 * 1000;
    }

    return Math.floor(diffMs / (1000 * 60));
};

const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'anonymous';
        image.src = url;
        image.onload = () => resolve(image);
        image.onerror = (error) => reject(error);
    });

const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
};
const formatDateIntl = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "long", year: "numeric" }).format(date);
};
const exportToExcel = (datalist, filename) => {
    filename ??= "DataFile"
    const worksheet = XLSX.utils.json_to_sheet(datalist);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    // Generate Excel file and trigger download
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const excelData = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(excelData, filename += '.xlsx');
};
const formatMinutesToHours = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hrs}h ${mins}m`;
};
const getISOWeekNumber = (date) => {
    const tempDate = new Date(date.getTime());
    tempDate.setHours(0, 0, 0, 0);
    tempDate.setDate(tempDate.getDate() + 3 - ((tempDate.getDay() + 6) % 7));
    const firstThursday = new Date(tempDate.getFullYear(), 0, 4);
    const diff = tempDate - firstThursday;
    return 1 + Math.round(diff / (7 * 24 * 60 * 60 * 1000));

};
function formatDateToYYYYMMDD(dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatDateToReadable(dateStr) {
    const date = new Date(dateStr);

    const day = date.getDate();
    const year = date.getFullYear();
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    const month = monthNames[date.getMonth()];

    return `${day} ${month} ${year}`;
}

function copyTextToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
        // Modern approach
        return navigator.clipboard.writeText(text);
    } else {
        // Fallback for older browsers
        return new Promise((resolve, reject) => {
            try {
                const textArea = document.createElement("textarea");
                textArea.value = text;

                // Avoid scrolling to bottom
                textArea.style.position = "fixed";
                textArea.style.top = 0;
                textArea.style.left = 0;
                textArea.style.opacity = 0;

                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);

                if (successful) {
                    resolve();
                } else {
                    reject(new Error('Fallback: Copy command was unsuccessful'));
                }
            } catch (err) {
                reject(err);
            }
        });
    }
}

export { getISOWeekNumber, copyTextToClipboard, formatMinutesToHours, formatDate, getTimeDifferenceInMinutes, createImage, convertToBase64, formatDateIntl, exportToExcel, formatDateToYYYYMMDD, formatDateToReadable };