// ⭐ FINAL — FULLY FIXED SupportTicketFrontend.jsx (TAILWIND)

import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

// Redux
import { fetchUsers } from "../Features/UserSlice";
import {
  fetchAllTickets,
  fetchTicketsByClient,
  createTicket,
  patchAssignAgent,
  patchUpdateStatus,
} from "../Features/TicketSlice";
import { addComment, fetchCommentsByTicket } from "../Features/CommentSlice";

// UI Components
import Sidebar from "./Sidebar";
import AdminDashboard from "./AdminDashboard";
import AgentDashboard from "./AgentDashboard";
import CustomerDashboard from "./CustomerDashboard";

export default function SupportTicketFrontend({ forcedRole }) {
  const dispatch = useDispatch();

  // ------------------ USER INFO ------------------
  const userId = Number(localStorage.getItem("userId"));
  const username = localStorage.getItem("username");
  const role = forcedRole || localStorage.getItem("role");

  const currentUser = { id: userId, name: username, role };

  // ------------------ REDUX STATE ------------------
  const users = useSelector((s) => s.users.list);
  const allTickets = useSelector((s) => s.tickets.tickets);
  const clientTickets = useSelector((s) => s.tickets.clientTickets);

  // ------------------ INITIAL LOAD ------------------
  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchAllTickets());
  }, [dispatch]);

  // ------------------ CUSTOMER LOAD ------------------
  useEffect(() => {
    if (role === "Customer") {
      dispatch(fetchTicketsByClient(userId));
    }
  }, [role, userId, dispatch]);

  // ------------------ AGENT TICKETS FILTER ------------------
  const agentTickets = useMemo(() => {
    return allTickets.filter(
      (t) => Number(t.assignedTo) === Number(userId)
    );
  }, [allTickets, userId]);


  // ------------------ ACTION HANDLERS ------------------

  const handleCreateTicket = (ticket) => {
    dispatch(createTicket(ticket));
  };

  const handleAssignTicket = (ticketId, agentId) => {
    dispatch(patchAssignAgent({ ticketId, agentId }));
  };
  const status = "Resolved";
  const handleUpdateStatus = (ticketId, status) => {
    dispatch(patchUpdateStatus({ ticketId, status}));
  };

  const handleAddComment = (ticketId, text) => {
    dispatch(
      addComment({
        ticketId,
        commentText: text,
        createdBy: userId,
      })
    );
    dispatch(fetchCommentsByTicket(ticketId));
  };

  // SUPPORT AGENTS LIST
  const supportAgents = users.filter((u) => u.role === "SupportAgent");

  // ------------------ UI RENDER ------------------
  return (
    <div className="w-screen h-screen flex flex-col bg-gray-100 overflow-hidden">

      {/* HEADER */}
      <header className="w-full bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Support Ticket System</h1>
        <span className="text-gray-600 text-sm">
          Logged in as: {username} ({role})
        </span>
      </header>

      {/* MAIN LAYOUT */}
      <div className="flex flex-grow overflow-hidden">

        {/* SIDEBAR */}
        <Sidebar role={role} />

        {/* MAIN DASHBOARD */}
        <div className="flex-1 overflow-y-auto">

          {/* ADMIN */}
          {role === "Admin" && (
            <AdminDashboard
              agents={supportAgents}
              tickets={allTickets}
              users={users}
              onAssign={handleAssignTicket}
              onClose={(id) => handleUpdateStatus(id, "Closed")}
            />
          )}

          {/* SUPPORT AGENT */}
          {(role === "SupportAgent"||"Agent") && (
            <AgentDashboard
              agent={currentUser}
              tickets={agentTickets}
              users={users}
              onResolve={(id) => handleUpdateStatus(id, status)}
              onComment={handleAddComment}
            />
          )}

          {/* CUSTOMER */}
          {role === "Customer" && (
            <CustomerDashboard
              customer={currentUser}
              tickets={clientTickets}
              users={users}
              onCreate={(t) => handleCreateTicket({ ...t, createdBy: userId })}
              onComment={handleAddComment}
            />
          )}

        </div>
      </div>
    </div>
  );
}
