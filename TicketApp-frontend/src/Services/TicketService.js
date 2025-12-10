import api from "../api";

const TICKETS_URL = "Tickets";



export const getAllTickets = async () => {
  const response = await api.get(TICKETS_URL);
  return response.data;
};

export const assignAgent = async (ticketId, agentId) => {
  const response = await api.patch(`${TICKETS_URL}/agent/${ticketId}`, {
    agentId,
  });
  return response.data;
};

export const updateStatus = async (ticketId, status) => {
  const response = await api.patch(`${TICKETS_URL}/${ticketId}/status`, {
    status,
  });
    console.log("📥 PATCH response:", response.data);

  return response.data;
};


export const getTicketById = async (id) => {
  const response = await api.get(`${TICKETS_URL}/${id}`);
  return response.data;
};

export const getTicketsByClient = async (createdBy) => {
  const response = await api.get(`${TICKETS_URL}/client/${createdBy}`);
  return response.data;
};

export const getTicketsByAgent = async (assignedTo) => {
  const response = await api.get(`${TICKETS_URL}/agent/${assignedTo}`);
  return response.data;
};

export const createTicket = async (ticket) => {
  console.log("TicketService: Calling API with ticket:", ticket);
  const response = await api.post(`${TICKETS_URL}/createticket`, ticket);
  console.log("TicketService: API response:", response.data);
  return response.data;
};

export const updateTicket = async (id, ticket) => {
  const response = await api.put(`${TICKETS_URL}/${id}`, ticket);
  return response.data;
};

export const deleteTicket = async (id) => {
  const response = await api.delete(`${TICKETS_URL}/${id}`);
  return response.data;
};

export default {
  getAllTickets,
  getTicketById,
  getTicketsByClient,
  getTicketsByAgent,
  createTicket,
  updateTicket,
  deleteTicket,
  assignAgent,
  updateStatus
};
