import endpoint from "../apiService.js";
import mainUrl from "../../constants/mainRoute.js";

export const getActivityAttendance = async (data) => {
  return await endpoint.post(`${mainUrl.ATTENDANCE}/getAttendance`, data);
};

export const addAttendanceLogin = async (data) => {
  return await endpoint.post(`${mainUrl.ATTENDANCE}/loginAttendance`, data);
};

export const addAttendanceLogout = async (data) => {
  return await endpoint.post(`${mainUrl.ATTENDANCE}/logoutAttendance`, data);
};

export const getAttendanceByDate = async (data) => {
  return await endpoint.post(`${mainUrl.ATTENDANCE}/getAttendanceByDate`, data);
};

export const checkTodayAttendance = async (data) => {
  return await endpoint.post(`${mainUrl.ATTENDANCE}/checkTodayAttendance`, data);
};