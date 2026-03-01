import axiosInstance from "./axiosInstance";

/* =========================
   SYSTEM
========================= */

export const getSystemAnalytics = async () => {
  const res = await axiosInstance.get("/admin/analytics");
  return res.data;
};

export const getSystemOverview = async () => {
  const res = await axiosInstance.get("/admin/overview");
  return res.data;
};

/* =========================
   USERS
========================= */

export const getAllUsers = async () => {
  const res = await axiosInstance.get("/admin/users");
  return res.data;
};

export const deleteUser = async (id: string) => {
  await axiosInstance.delete(`/admin/users/${id}`);
};

export const updateUserRole = async (
  id: string,
  role: string
) => {
  await axiosInstance.patch(
    `/admin/users/${id}/role`,
    { role }
  );
};

/* =========================
   PREDICTIONS
========================= */

export const getAllPredictions = async () => {
  const res = await axiosInstance.get("/admin/predictions");
  return res.data;
};

export const deletePrediction = async (id: string) => {
  await axiosInstance.delete(`/admin/predictions/${id}`);
};