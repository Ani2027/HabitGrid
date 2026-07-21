import axiosInstance from "../../api/axios.instance";

export const registerUser = async (username, email, password) => {
    const response = await axiosInstance.post("/api/auth/register", {
        username,
        email,
        password,
    });
    return response.data;
};

export const loginUser = async (email, password) => {
    const response = await axiosInstance.post("/api/auth/login", {
        email,
        password,
    });
    return response.data;
};

export const refreshAccessToken = async () => {
    const response = await axiosInstance.get("/api/auth/refresh-token");
    return response.data;
};

export const getMe = async () => {
    const response = await axiosInstance.get("/api/auth/get-me");
    return response.data;
};

export const logoutUser = async () => {
    const response = await axiosInstance.post("/api/auth/logout");
    return response.data;
};
