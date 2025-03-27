import endpoint from "../apiService.js";
import mainUrl from "../../constants/mainRoute.js";

export const getEmployee = async () => {
  return await endpoint.get(`${mainUrl.EMPLOYEE}/getEmployees`);
};

export const updatePassword = async (data) => {
  return await endpoint.post(`${mainUrl.EMPLOYEE}/updatePassword`, data);
};

export const deleteEmployee = async (data) => {
  return await endpoint.post(`${mainUrl.EMPLOYEE}/deleteEmployee`, data);
};

export const getEmployeesNotPassword = async () => {
  return await endpoint.get(`${mainUrl.EMPLOYEE}/getEmployeesNotPassword`);
};

export const getUserAccounts = async () => {
  return await endpoint.get(`${mainUrl.EMPLOYEE}/getUserAccounts`);
};