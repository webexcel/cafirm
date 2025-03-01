import endpoint from "./apiService";
import mainUrl from "../constants/mainRoute.js";

export const loginService = async (data) => {
  return await endpoint.post(`${mainUrl.AUTH}/login`, data);
};
