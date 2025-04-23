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
export { formatMinutesToHours,formatDate, getTimeDifferenceInMinutes, createImage, convertToBase64, formatDateIntl,exportToExcel };