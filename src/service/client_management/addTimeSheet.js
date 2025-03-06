import endpoint from "../apiService.js";
import mainUrl from "../../constants/mainRoute.js";

export const getTimesheet = async () => {
  return await endpoint.get(`${mainUrl.TIMESHEET}/getTimesheet`);
};

export const addTimesheet = async (data) => {
  return await endpoint.post(`${mainUrl.TIMESHEET}/addTimesheet`, data);
};

export const deleteTimesheet = async (data) => {
  return await endpoint.post(`${mainUrl.TIMESHEET}/deleteTimesheet`, data);
};
