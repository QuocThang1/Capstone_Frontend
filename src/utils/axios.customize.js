import axios from "axios";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

// Set config defaults when creating the instance
const instance = axios.create({
    baseURL: BACKEND_URL,
    timeout: 30000, // 30 seconds timeout
});

// Alter defaults after instance has been created

// Add a request interceptor
instance.interceptors.request.use(
    function (config) {
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    },
);

// Add a response interceptor
instance.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data
        if (response && response.data) {
            return response.data;
        }
        return response;
    },
    function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        const requestUrl = error?.config?.url || "";
        const hasStoredToken = Boolean(localStorage.getItem("access_token"));
        if (error?.response?.status === 401 && hasStoredToken && !requestUrl.includes("/account/login")) {
            localStorage.removeItem("access_token");
            window.dispatchEvent(new Event("auth:unauthorized"));
        }
        if (error?.response?.data) {
            return error?.response?.data;
        }
        return Promise.reject(error);
    },
);

export default instance;
