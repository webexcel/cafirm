import axios from "axios";
const BASE_URL = import.meta.env.VITE_BASE_URL;
const PORT = import.meta.env.VITE_PORT;
import { getToken } from "../utils/authUtils";
const endpoint = axios.create({
  baseURL: `${BASE_URL}/api/`,
  headers: {
    "Content-Type": "application/json",
  },
}); 

endpoint.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

endpoint.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("api interceptor", error.response);
    if (error.response && [401, 403].includes(error.response.status)) {
      console.error("Unauthorized, please login again.");
      localStorage.clear();
    }
    return Promise.reject(error);
  }
);

export default endpoint;
