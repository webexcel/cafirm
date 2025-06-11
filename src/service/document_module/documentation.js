import endpoint from "../apiService.js";
import mainUrl from "../../constants/mainRoute.js";

export const getDocumentsService = async () => {
  return await endpoint.get(`${mainUrl.DOCUMENT}/getDocuments`);
};

// export const addTimesheet = async (data) => {
//   return await endpoint.post(`${mainUrl.TIMESHEET}/addTimesheet`, data);
// };

// export const deleteTimesheet = async (data) => {
//   return await endpoint.post(`${mainUrl.TIMESHEET}/deleteTimesheet`, data);
// };
