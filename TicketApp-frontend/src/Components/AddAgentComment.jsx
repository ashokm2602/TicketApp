import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTicketsByClient } from "../Features/TicketSlice";
import { fetchCommentsByTicket } from "../Features/CommentSlice";
import AddComment from "./AddAgentComment"; 
import "./TicketList.css";

export default function TicketList() {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");

  const ticketsState = useSelector((state) => state.tickets);
  const commentsState = useSelector((state) => state.comments);

  const tickets = ticketsState?.list ?? [];
  const loading = ticketsState?.loading;
  const error = ticketsState?.error;

  // ⬅ FIXED: comments stored inside commentsByTicket, NOT commentsState.list
  const commentsByTicket = commentsState?.commentsByTicket ?? {};

  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    if (userId) {
      dispatch(fetchTicketsByClient(userId));
    }
  }, [dispatch, userId]);

  const toggleComments = (ticketId) => {
    if (expanded === ticketId) {
      setExpanded(null);
      return;
    }
    setExpanded(ticketId);
    dispatch(fetchCommentsByTicket(ticketId)); // fetch comments when expanded
  };

  if (loading) return <p className="ticket-list-status">Loading tickets...</p>;
  if (error) return <p className="ticket-list-status">Error: {error}</p>;

  return (
    <div className="ticket-list">
      <h2>Your Tickets</h2>

      {tickets.length === 0 ? (
        <p className="ticket-list-status">No tickets found.</p>
      ) : (
        <div className="ticket-list-grid">
          {tickets.map((ticket) => {
            const ticketComments = commentsByTicket[ticket.ticketId] || [];

            return (
              <div key={ticket.ticketId} className="ticket-card">
                <h3>{ticket.title}</h3>
                <p>{ticket.description}</p>

                <div className="ticket-meta">
                  <span>Status:</span>
                  <span
                    className={
                      "ticket-status-pill " +
                      (ticket.status === "Open"
                        ? "ticket-status-open"
                        : "ticket-status-closed")
                    }
                  >
                    {ticket.status}
                  </span>

                  <span>Priority:</span>
                  <span
                    className={
                      "ticket-priority-pill " +
                      (ticket.priority === "Low"
                        ? "ticket-priority-low"
                        : ticket.priority === "Medium"
                        ? "ticket-priority-medium"
                        : "ticket-priority-high")
                    }
                  >
                    {ticket.priority}
                  </span>
                </div>

                <button
                  className="comment-toggle-btn"
                  onClick={() => toggleComments(ticket.ticketId)}
                >
                  {expanded === ticket.ticketId ? "Hide Comments" : "Show Comments"}
                </button>

                {expanded === ticket.ticketId && (
                  <div className="comments-section">
                    <h4>Comments</h4>

                    {ticketComments.length === 0 ? (
                      <p>No comments yet.</p>
                    ) : (
                      ticketComments.map((c) => (
                        <div key={c.commentId} className="comment-item">
                          <p>{c.message}</p>
                          <span className="comment-date">
                            {new Date(c.createdDate).toLocaleString()}
                          </span>
                        </div>
                      ))
                    )}

                    {/* ⬇⬇ ADDED COMPONENT HERE ⬇⬇ */}
                    <AddComment ticketId={ticket.ticketId} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
