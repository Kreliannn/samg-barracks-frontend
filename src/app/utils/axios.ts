import axios from "axios";

const localhost = "http://localhost:5000"

const axiosInstance = axios.create({
  baseURL: "https://barracks-test-code.onrender.com",  
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
