import api from "../api";
const COMMENTS_URL = "/Comments";

export const getCommentsByTicketId = async (ticketId) => {
  const response = await api.get(`${COMMENTS_URL}/ticket/${ticketId}`);
  return response.data;
};

export const getCommentById = async (id) => {
  const response = await api.get(`${COMMENTS_URL}/${id}`);
  return response.data;
};

export const addComment = async (comment) => {
  const response = await api.post(COMMENTS_URL, comment);
  return response.data;
};

export const deleteComment = async (id) => {
  const response = await api.delete(`${COMMENTS_URL}/${id}`);
  return response.data;
};

export default {
  getCommentsByTicketId,
  getCommentById,
  addComment,
  deleteComment,
};
