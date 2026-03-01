import axios from "axios";
import type {
  Profile,
  UpdateProfilePayload,
  ChangePasswordPayload,
} from "../types/user.types";

const API = axios.create({
  baseURL: "https://crop-yield-ai-ilwk.onrender.com/api",
  withCredentials: true,
});

// Attach token automatically
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* ============================= */
/* Profile APIs */
/* ============================= */

export const getProfile = async (): Promise<Profile> => {
  const res = await API.get("/api/users/me");
  return res.data;
};

export const updateProfile = async (
  payload: UpdateProfilePayload
) => {
  return API.put("/api/users/me", payload);
};

export const changePassword = async (
  payload: ChangePasswordPayload
) => {
  return API.put("/api/users/change-password", payload);
};

export default API;