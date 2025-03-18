import endpoint from "../apiService.js";
import mainUrl from "../../constants/mainRoute.js";


export const getAllEmpRecord= async (data) => {
  return await endpoint.post(`${mainUrl.EMPMONITOR}/getAllEmployeeRecords`, data);
};

export const addEmpRecord = async (data) => {
  return await endpoint.post(`${mainUrl.EMPMONITOR}/addRecord`, data);
};

export const deleteEmpRecord = async (data) => {
  return await endpoint.post(`${mainUrl.EMPMONITOR}/deleteRecord`, data);
};