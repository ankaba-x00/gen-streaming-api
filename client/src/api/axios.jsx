import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.accessToken) {
      config.headers.token = `Bearer ${user.accessToken}`;
    }
    config.headers["x-frontend"] = "client";
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
