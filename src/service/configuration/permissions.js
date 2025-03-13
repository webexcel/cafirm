import endpoint from "../apiService";
import mainUrl from "../../constants/mainRoute.js";

export const getPermissionsList = async (data) => {
    return await endpoint.get(`${mainUrl.PERMISSIONS}/permissions`,data);
  };
  
  export const getMenuOperationsList = async (data) => {
    return await endpoint.get(`${mainUrl.PERMISSIONS}/menu-operations`,data); 
  };


  export const addPermissions = async (data) => {
    return await endpoint.post(`${mainUrl.PERMISSIONS}/add`,data); 
  };

  export const getUsersList = async (data) => {
    return await endpoint.get(`${mainUrl.PERMISSIONS}/allusers`,data); 
  };
  
  export const assignPermission = async (data) => {
    return await endpoint.post(`${mainUrl.PERMISSIONS}/assign`,data); 
  };

  export const getUserPermissions = async (userId) => {
    return await endpoint.get(`${mainUrl.PERMISSIONS}/user/${userId}`); 
  };

  export const updatePermissions = async (permissionId,data) => {
    return await endpoint.put(`${mainUrl.PERMISSIONS}/update/${permissionId}`,data); 
  };