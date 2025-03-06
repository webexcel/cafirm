import endpoint from "../apiService.js";
import mainUrl from "../../constants/mainRoute.js";

export const addTicket = async (data) => {
  return await endpoint.post(`${mainUrl.TICKET}/addTicket`, data);
};

export const getAllTicket = async (data) => {
  return await endpoint.post(`${mainUrl.TICKET}/getTicketsByType`, data);
};

export const updateTicketStatus = async (data) => {
  return await endpoint.post(`${mainUrl.TICKET}/ticketStatusUpdate`, data);
};

export const deleteTaskService = async (data) => {
  return await endpoint.post(`${mainUrl.TASK}/deleteTicket`, data);
};