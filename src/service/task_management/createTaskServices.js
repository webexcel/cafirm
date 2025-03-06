import endpoint from "../apiService.js";
import mainUrl from "../../constants/mainRoute.js";

export const addTask = async (data) => {
  return await endpoint.post(`${mainUrl.TASK}/addTask`, data);
};

export const getAllTask = async (data) => {
  return await endpoint.post(`${mainUrl.TASK}/getTasksByType`, data);
};

export const updateTaskStatus = async (data) => {
  return await endpoint.post(`${mainUrl.TASK}/taskStatusUpdate`, data);
};

export const deleteTaskService = async (data) => {
  return await endpoint.post(`${mainUrl.TASK}/deleteTask`, data);
};