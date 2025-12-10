// src/Features/TicketSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ticketService from "../Services/TicketService";

// ----------------------------- NORMALIZER -----------------------------
const normalizeTicket = (t) => {
  if (!t) return t;

  return {
    ticketId: t.ticketId ?? t.TicketId,
    title: t.title ?? t.Title,
    description: t.description ?? t.Description,

    // Keep strings for UI values
    priority: String(t.priority),
    status: String(t.status),

    // Ensure numeric IDs (so `===` comparisons work)
    createdBy: Number(t.createdBy ?? t.CreatedBy ?? 0),
    assignedTo: Number(t.assignedTo ?? t.AssignedTo ?? 0),
  };
};

// ----------------------------- ASYNC THUNKS -----------------------------
export const fetchAllTickets = createAsyncThunk("tickets/fetchAll", async () => {
  const res = await ticketService.getAllTickets();
  // res should be an array; return raw payload, reducers will normalize
  return res;
});

export const fetchTicketById = createAsyncThunk("tickets/fetchById", async (id) => {
  const res = await ticketService.getTicketById(id);
  return res;
});

export const fetchTicketsByClient = createAsyncThunk(
  "tickets/fetchByClient",
  async (createdBy) => {
    const res = await ticketService.getTicketsByClient(createdBy);
    return res;
  }
);

export const fetchTicketsByAgent = createAsyncThunk(
  "tickets/fetchByAgent",
  async (assignedTo) => {
    // call the service, log result for debugging, then return payload
    const result = await ticketService.getTicketsByAgent(assignedTo);
    console.log("🔥 fetchTicketsByAgent RESULT FROM API:", result);
    return result;
  }
);

export const createTicket = createAsyncThunk("tickets/create", async (ticket) => {
  const res = await ticketService.createTicket(ticket);
  return res;
});

export const patchAssignAgent = createAsyncThunk(
  "tickets/assignAgent",
  async ({ ticketId, agentId }) => {
    const res = await ticketService.assignAgent(ticketId, agentId);
    return res;
  }
);

export const patchUpdateStatus = createAsyncThunk(
  "tickets/updateStatus",
  async ({ ticketId, status }) => {
    const res = await ticketService.updateStatus(ticketId, status);
    return res;
  }
);

export const updateTicket = createAsyncThunk(
  "tickets/update",
  async ({ id, ticket }) => {
    const res = await ticketService.updateTicket(id, ticket);
    return res;
  }
);

export const deleteTicket = createAsyncThunk("tickets/delete", async (id) => {
  await ticketService.deleteTicket(id);
  return id;
});

// ----------------------------- SLICE -----------------------------
const ticketsSlice = createSlice({
  name: "tickets",
  initialState: {
    tickets: [],
    clientTickets: [],
    agentTickets: [],
    singleTicket: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    const setPending = (state) => {
      state.loading = true;
      state.error = null;
    };

    const setRejected = (state, action) => {
      state.loading = false;
      state.error = action.error?.message ?? "Unknown error";
    };

    // FETCH ALL
    builder.addCase(fetchAllTickets.pending, setPending);
    builder.addCase(fetchAllTickets.fulfilled, (state, action) => {
      state.loading = false;
      state.tickets = (action.payload || []).map(normalizeTicket);
    });
    builder.addCase(fetchAllTickets.rejected, setRejected);

    // PATCH: assign agent (update the ticket in the lists)
    builder.addCase(patchAssignAgent.fulfilled, (state, action) => {
      const updated = normalizeTicket(action.payload);

      state.tickets = state.tickets.map((t) =>
        t.ticketId === updated.ticketId ? updated : t
      );

      state.clientTickets = state.clientTickets.map((t) =>
        t.ticketId === updated.ticketId ? updated : t
      );

      state.agentTickets = state.agentTickets.map((t) =>
        t.ticketId === updated.ticketId ? updated : t
      );
    });

    // PATCH: update status
    builder.addCase(patchUpdateStatus.fulfilled, (state, action) => {
      const updated = normalizeTicket(action.payload);

      state.tickets = state.tickets.map((t) =>
        t.ticketId === updated.ticketId ? updated : t
      );

      state.clientTickets = state.clientTickets.map((t) =>
        t.ticketId === updated.ticketId ? updated : t
      );

      state.agentTickets = state.agentTickets.map((t) =>
        t.ticketId === updated.ticketId ? updated : t
      );
    });

    // FETCH BY CLIENT
    builder.addCase(fetchTicketsByClient.pending, setPending);
    builder.addCase(fetchTicketsByClient.fulfilled, (state, action) => {
      state.loading = false;
      state.clientTickets = (action.payload || []).map(normalizeTicket);
    });
    builder.addCase(fetchTicketsByClient.rejected, setRejected);

    // FETCH BY AGENT
    builder.addCase(fetchTicketsByAgent.pending, setPending);
    builder.addCase(fetchTicketsByAgent.fulfilled, (state, action) => {
      state.loading = false;
      state.agentTickets = (action.payload || []).map(normalizeTicket);
    });
    builder.addCase(fetchTicketsByAgent.rejected, setRejected);

    // FETCH SINGLE
    builder.addCase(fetchTicketById.pending, setPending);
    builder.addCase(fetchTicketById.fulfilled, (state, action) => {
      state.loading = false;
      state.singleTicket = normalizeTicket(action.payload);
    });
    builder.addCase(fetchTicketById.rejected, setRejected);

    // CREATE
    builder.addCase(createTicket.pending, setPending);
    builder.addCase(createTicket.fulfilled, (state, action) => {
      state.loading = false;

      const created = normalizeTicket(action.payload);

      // Add to all required lists
      state.tickets.unshift(created);
      state.clientTickets.unshift(created);
    });
    builder.addCase(createTicket.rejected, setRejected);

    // UPDATE (full update)
    builder.addCase(updateTicket.pending, setPending);
    builder.addCase(updateTicket.fulfilled, (state, action) => {
      state.loading = false;

      const updated = normalizeTicket(action.payload);

      const updateList = (list) => list.map((t) => (t.ticketId === updated.ticketId ? updated : t));

      state.tickets = updateList(state.tickets);
      state.clientTickets = updateList(state.clientTickets);
      state.agentTickets = updateList(state.agentTickets);
    });
    builder.addCase(updateTicket.rejected, setRejected);

    // DELETE
    builder.addCase(deleteTicket.pending, setPending);
    builder.addCase(deleteTicket.fulfilled, (state, action) => {
      state.loading = false;
      const id = action.payload;

      const filterList = (list) => list.filter((t) => t.ticketId !== id);

      state.tickets = filterList(state.tickets);
      state.clientTickets = filterList(state.clientTickets);
      state.agentTickets = filterList(state.agentTickets);
    });
    builder.addCase(deleteTicket.rejected, setRejected);
  },
});

export default ticketsSlice.reducer;
