import endpoint from "../apiService";
import mainUrl from "../../constants/mainRoute.js";

export const getMenuList = async () => {
  return await endpoint.get(`${mainUrl.MENU}/getMenuList`);
};

export const addMenu = async (data) => {
  return await endpoint.post(`${mainUrl.MENU}/addMenu`, data);
};

export const getOperationList = async (data) => {
  return await endpoint.post(`${mainUrl.MENU}/getOperationList`, data);
};

export const addMenuOperations = async (data) => {
  return await endpoint.post(`${mainUrl.MENU}/addMenuOperations`, data);
};

export const getParentMenuList = async () => {
  return await endpoint.get(`${mainUrl.MENU}/getParentMenuList`);
};

export const getOperationMappedList = async () => {
  return await endpoint.get(`${mainUrl.MENU}/getOperationMappedList`);
};

export const deleteMenu = async (data) => {
  return await endpoint.post(`${mainUrl.MENU}/deleteMenu`,data);
};
export const updateMenu = async (data) => {
  return await endpoint.post(`${mainUrl.MENU}/updateMenu`,data);
};