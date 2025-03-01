import { getToken } from "../utils/authUtils";

export const isAuthenticated = () => {
    const token = getToken();
    return Boolean(token);
}