import endpoint from "../apiService.js";
import mainUrl from "../../constants/mainRoute.js";

export const getEmployeeDetails = async (data) => {
  return await endpoint.post(`${mainUrl.EMPLOYEE}/getEmployeeDetails`, data);
};

export const editEmployeeDetails = async (data) => {
  return await endpoint.post(`${mainUrl.EMPLOYEE}/editEmployee`, data);
};
