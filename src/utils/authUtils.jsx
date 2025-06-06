export const getToken = () => {
    try {
        const token = localStorage.getItem('ca_authToken');
        return token;
    }
    catch (error) {
        console.error('Error retrieving token from localStorage:', err);
        return null;
    }
}

export const setToken = (token) => {
    if (!token) {
        console.warn("Token is invalid or missing.");
    }
    localStorage.setItem("ca_authToken", token);
};

export const deleteToken = () => {
    localStorage.removeItem("ca_authToken");
};