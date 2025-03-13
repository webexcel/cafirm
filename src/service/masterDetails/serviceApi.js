import endpoint from "../apiService.js";
import mainUrl from "../../constants/mainRoute.js";

export const getService = async () => {
  return await endpoint.get(`${mainUrl.MASTER}/${mainUrl.SERVICE}/getServices`);
};

export const addService = async (data) => {
  return await endpoint.post(
    `${mainUrl.MASTER}/${mainUrl.SERVICE}/addService`,
    data
  );
};

export const deleteService = async (data) => {
  return await endpoint.post(
    `${mainUrl.MASTER}/${mainUrl.SERVICE}/deleteService`,
    data
  );
};
