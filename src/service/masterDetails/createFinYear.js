import endpoint from "../apiService.js";
import mainUrl from "../../constants/mainRoute.js";

export const getYearList = async () => {
  return await endpoint.get(`${mainUrl.MASTER}/${mainUrl.YEAR}/getYearList`);
};

export const addYear = async (data) => {
  return await endpoint.post(
    `${mainUrl.MASTER}/${mainUrl.YEAR}/addYear`,
    data
  );
};

export const editYear = async (data) => {
  return await endpoint.post(
    `${mainUrl.MASTER}/${mainUrl.YEAR}/editYear`,
    data
  );
};

export const deleteYear = async (data) => {
  return await endpoint.post(
    `${mainUrl.MASTER}/${mainUrl.YEAR}/deleteYear`,
    data
  );
};
