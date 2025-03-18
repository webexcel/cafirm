import endpoint from "./apiService";
import mainUrl from "../constants/mainRoute.js";

export const loginService = async (data) => {
  return await endpoint.post(`${mainUrl.AUTH}/login`, data);
};

export const ForgotPasswordService = async (data) => {
  return await endpoint.post(`${mainUrl.AUTH}/forgot_password`, data);
};

export const ResetPasswordService = async (data) => {
	return axios.post('/api/auth/reset_password', data);
};