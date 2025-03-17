

import mainUrl from "../constants/mainRoute.js";
import endpoint from "./apiService.js";

export const getDashboard = async () => {
    return await endpoint.get(`${mainUrl.DASHBOARD}/getDashboardData`,);
  };