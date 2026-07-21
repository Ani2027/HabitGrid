import axios from "axios";

let accessToken = null;

export const setAccessToken = (token) => {
    accessToken = token;
};

export const getAccessToken = () => accessToken;

export const clearAccessToken = () => {
    accessToken = null;
};

// In dev: VITE_API_URL is empty → baseURL is "" → Vite proxy forwards /api/* to localhost:5000
// In production: VITE_API_URL = "https://personal-dashboard-uef5.onrender.com" (set in Vercel)
const API_BASE_URL = import.meta.env.VITE_API_URL || "";

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

axiosInstance.interceptors.request.use(
    (config) => {
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

let isRefreshing = false;
let pendingQueue = [];

const processQueue = (error, token = null) => {
    pendingQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    pendingQueue = [];
};

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    pendingQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return axiosInstance(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await axios.get(`${API_BASE_URL}/api/auth/refresh-token`, {
                    withCredentials: true,
                });
                const newToken = data.accessToken;
                setAccessToken(newToken);
                processQueue(null, newToken);

                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                clearAccessToken();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
