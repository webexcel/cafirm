import endpoint from "../apiService.js";
import mainUrl from "../../constants/mainRoute.js";


export const getEmployeeYearlyReport = async (data) => {
  return await endpoint.post(`${mainUrl.CHARTS}/getYearlyEmployeeReport`, data);
};

export const getEmployeeMonthlyReport = async (data) => {
  return await endpoint.post(`${mainUrl.CHARTS}/getMonthlyEmployeeReport`, data);
};

export const getEmployeeWeeklyReport = async (data) => {
  return await endpoint.post(`${mainUrl.CHARTS}/getWeeklyEmployeeReport`, data);
};

export const getClientYearlyReport = async (data) => {
  return await endpoint.post(`${mainUrl.CHARTS}/getYearlyClientReport`, data);
};

export const getClientMonthlyReport = async (data) => {
  return await endpoint.post(`${mainUrl.CHARTS}/getMonthlyClientReport`, data);
};

export const getClientWeeklyReport = async (data) => {
  return await endpoint.post(`${mainUrl.CHARTS}/getWeeklyClientReport`, data);
};