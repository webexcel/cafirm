export const getToken = () => {
    try {
        const token = localStorage.getItem('authToken');
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
    localStorage.setItem("authToken", token);
};

export const deleteToken = () => {
    localStorage.removeItem("authToken");
};