import endpoint from "../apiService.js";
import mainUrl from "../../constants/mainRoute.js";

export const getClientType = async () => {
  return await endpoint.get(`${mainUrl.MASTER}/${mainUrl.CLIENT_TYPE}/getClientType`);
};

export const addClientType = async (data) => {
  return await endpoint.post(
    `${mainUrl.MASTER}/${mainUrl.CLIENT_TYPE}/addClientType`,
    data
  );
};

export const editClientType = async (data) => {
  return await endpoint.post(
    `${mainUrl.MASTER}/${mainUrl.CLIENT_TYPE}/editClientType`,
    data
  );
};

export const deleteClientType = async (data) => {
  return await endpoint.post(
    `${mainUrl.MASTER}/${mainUrl.CLIENT_TYPE}/deleteClientType`,
    data
  );
};
