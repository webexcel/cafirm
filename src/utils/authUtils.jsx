import Cookies from "js-cookie";

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

/**
 * Get cookie value by key
 */
export const getUserCookie = (key) => {
    const cookie = Cookies.get(String(key));
    return cookie || null;
};

/**
 * Update or set cookie value
 */
export const updateUserCookie = (key, value, options = {}) => {
    Cookies.set(String(key), String(value), {
        expires: 7, // default to 7 days
        path: '/',  // default path
        ...options,
    });
};

/**
 * Delete cookie
 */
export const deleteUserCookie = (key) => {
    Cookies.remove(String(key), { path: '/' });
};

// compare object

export function deepEqual(obj1, obj2) {
    if (obj1 === obj2) return true;

    if (
        typeof obj1 !== 'object' || obj1 === null ||
        typeof obj2 !== 'object' || obj2 === null
    ) {
        return false;
    }

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
        if (!keys2.includes(key)) return false;

        const val1 = obj1[key];
        const val2 = obj2[key];

        const areObjects = typeof val1 === 'object' && typeof val2 === 'object';

        if (
            (areObjects && !deepEqual(val1, val2)) ||
            (!areObjects && val1 !== val2)
        ) {
            return false;
        }
    }

    return true;
}




