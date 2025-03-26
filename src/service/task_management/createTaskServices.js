import endpoint from "../apiService.js";
import mainUrl from "../../constants/mainRoute.js";

export const addTask = async (data) => {
  return await endpoint.post(`${mainUrl.SERVICETASK}/addTask`, data);
};

export const getAllTask = async (data) => {
  return await endpoint.post(`${mainUrl.SERVICETASK}/getTasksByType`, data);
};

export const updateTaskStatus = async (data) => {
  return await endpoint.post(`${mainUrl.SERVICETASK}/taskStatusUpdate`, data);
};

export const deleteTaskService = async (data) => {
  return await endpoint.post(`${mainUrl.SERVICETASK}/deleteTask`, data);
};

export const getTasksByPriority = async () => {
  return await endpoint.get(`${mainUrl.SERVICETASK}/getTasksByPriority`);
};

export const getViewTasks = async (data) => {
  return await endpoint.post(`${mainUrl.SERVICETASK}/getViewTasks`, data);
};

export const editTaskData = async (data) => {
  return await endpoint.post(`${mainUrl.SERVICETASK}/editTask`, data);
};

export const deleteTaskData = async (data) => {
  return await endpoint.post(`${mainUrl.SERVICETASK}/deleteTask`, data);
};

export const getServicesForTask = async (data) => {
  return await endpoint.post(`${mainUrl.SERVICETASK}/getServicesForTask`, data);
};
