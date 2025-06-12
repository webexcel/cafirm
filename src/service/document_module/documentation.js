import endpoint from "../apiService.js";
import mainUrl from "../../constants/mainRoute.js";

export const getDocumentsService = async () => {
  return await endpoint.get(`${mainUrl.DOCUMENT}/getDocuments`);
};

export const addDocument = async (data) => {
  return await endpoint.post(`${mainUrl.DOCUMENT}/addDocument`, data);
};

export const deleteDocument = async (data) => {
  return await endpoint.post(`${mainUrl.DOCUMENT}/deleteDocument`, data);
};
