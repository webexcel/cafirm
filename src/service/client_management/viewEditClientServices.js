import endpoint from "../apiService.js";
import mainUrl from "../../constants/mainRoute.js";

export const getClientDetails = async (data) => {
  return await endpoint.post(`${mainUrl.CLIENT}/getClientDetails`, data);
};

export const editClientDetails = async (data) => {
  return await endpoint.post(`${mainUrl.CLIENT}/editClient`, data);
};
