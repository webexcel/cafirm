import endpoint from "../apiService.js";
import mainUrl from "../../constants/mainRoute.js";

export const viewEmpTimeSheet = async () => {
  return await endpoint.get(`${mainUrl.EMPTIMESHEET}/getEmployeeTimesheet`);
};

export const getEmpTimeSheet = async (data) => {
  return await endpoint.post(
    `${mainUrl.EMPTIMESHEET}/searchEmployeeTimesheet`,
    data
  );
};

export const getTimeSheetService = async () => {
  return await endpoint.get(`${mainUrl.TIMESHEET}/getTimesheet`);
};

export const getServiceByClient = async (data) => {
  return await endpoint.post(`${mainUrl.TIMESHEET}/getService`, data);
};

export const getEmployeeByService = async (data) => {
  return await endpoint.post(`${mainUrl.TIMESHEET}/getemployee`, data);
};

export const getTaskByEmployee = async (data) => {
  return await endpoint.post(`${mainUrl.TIMESHEET}/getTaskList`, data);
};