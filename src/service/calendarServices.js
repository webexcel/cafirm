import mainUrl from "../constants/mainRoute.js";
import endpoint from "./apiService.js";

export const getCalendarList = async () => {
  return await endpoint.get(`${mainUrl.CALENDAR}/getCalendarDetails`);
};

export const addCalendarEvent = async (data) => {
  return await endpoint.post(`${mainUrl.CALENDAR}/addEvent`, data);
};

export const editCalendarEvent = async (data) => {
  return await endpoint.post(`${mainUrl.CALENDAR}/editEvent`, data);
};
export const deleteCalendarEvent = async (data) => {
  return await endpoint.post(`${mainUrl.CALENDAR}/deleteEvent`, data);
};
