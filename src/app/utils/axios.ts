import axios from "axios";

// CHOICES
const localhost = "http://localhost:5000"
const live = "https://barracks-test-code.onrender.com"

const axiosInstance = axios.create({
  baseURL: localhost,  
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;
