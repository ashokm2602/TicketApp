import api from "../api";

const USERS_URL = "/Users";

export const getAllUsers = async () => {
  const response = await api.get(USERS_URL);
  return response.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`${USERS_URL}/GetUserById${id}`);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`${USERS_URL}/DeleteUser${id}`);
  return response.data;
};

export const getSupportAgents = async () => {
  const res = await api.get("/Users/supportagents");
  return res.data;
};

export const addUser = async (user) => {
  const response = await api.post(USERS_URL, user);
  return response.data;
};

export const updateUser = async (id, user) => {
  const response = await api.put(`${USERS_URL}/UpdateUser${id}`, user);
  return response.data;
};

export const getUsersByRole = async (role) => {
  const response = await api.get(`${USERS_URL}/role/`, { params: { role } });
  return response.data;
};

export const getUserByEmail = async (email) => {
  const response = await api.get(`${USERS_URL}/email/`, { params: { email } });
  return response.data;
};

export default {
  getAllUsers,
  getUserById,
  deleteUser,
  addUser,
  updateUser,
  getUsersByRole,
  getUserByEmail,
};
