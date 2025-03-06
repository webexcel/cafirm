import endpoint from "../apiService.js";
import mainUrl from "../../constants/mainRoute.js";

export const getClient = async () => {
  return await endpoint.get(`${mainUrl.CLIENT}/getClients`);
};

export const addClient = async (data) => {
  return await endpoint.post(`${mainUrl.CLIENT}/addClient`, data);
};

export const deleteClient = async (data) => {
  return await endpoint.post(`${mainUrl.CLIENT}/deleteClient`, data);
};
