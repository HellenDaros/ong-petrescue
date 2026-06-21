import axios from "axios";
import Cookies from "js-cookie";
import { store } from "../redux/store";

const api = axios.create({
  baseURL: "http://localhost:8080",
});
api.interceptors.request.use((config) => {
  const token = store.getState().auth.token;

  console.log("TOKEN INTERCEPTOR:", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
