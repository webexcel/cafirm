import endpoint from "../apiService.js";
import mainUrl from "../../constants/mainRoute.js";

export const getEmployee = async () => {
  return await endpoint.get(`${mainUrl.EMPLOYEE}/getEmployees`);
};

export const addEmployee = async (data) => {
  return await endpoint.post(`${mainUrl.EMPLOYEE}/addEmployee`, data);
};

export const deleteEmployee = async (data) => {
  return await endpoint.post(`${mainUrl.EMPLOYEE}/deleteEmployee`, data);
};
