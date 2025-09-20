import endpoint from "../apiService.js";
import mainUrl from "../../constants/mainRoute.js";

export const getDocumentType = async () => {
  return await endpoint.get(`${mainUrl.MASTER}/${mainUrl.DOCUMENTTYPE}/getDocumentType`);
};

export const addDocumentType = async (data) => {
  return await endpoint.post(
    `${mainUrl.MASTER}/${mainUrl.DOCUMENTTYPE}/addDocumentType`,
    data
  );
};

export const editDocumentType = async (data) => {
  return await endpoint.post(
    `${mainUrl.MASTER}/${mainUrl.DOCUMENTTYPE}/editDocumentType`,
    data
  );
};

export const deleteDocumentType = async (data) => {
  return await endpoint.post(
    `${mainUrl.MASTER}/${mainUrl.DOCUMENTTYPE}/deleteDocumentType`,
    data
  );
};
