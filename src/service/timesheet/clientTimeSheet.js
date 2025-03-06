import endpoint from "../apiService.js";
import mainUrl from "../../constants/mainRoute.js";

export const viewCliTimeSheet = async () => {
  return await endpoint.get(`${mainUrl.CLITIMESHEET}/getClientTimesheet`);
};

export const getCliTimeSheet = async (data) => {
  return await endpoint.post(`${mainUrl.CLITIMESHEET}/searchClientTimesheet`, data);
};

