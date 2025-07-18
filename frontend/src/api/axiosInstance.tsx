import axios from "axios";

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_backend_url + "/api",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;