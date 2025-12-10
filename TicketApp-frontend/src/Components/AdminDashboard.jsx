import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchAllTickets } from "../Features/TicketSlice";
import { fetchCommentsByTicket } from "../Features/CommentSlice";

import AddComment from "./AddAgentComment";
import UpdateTicket from "./UpdateTicket";

import "./AdminDashboard.css";

export default function AdminDashboard() {
  const dispatch = useDispatch();

  // ✔ FIX: correct slice field is tickets.tickets
  const tickets = useSelector((state) => state.tickets?.tickets || []);

  const commentsByTicket = useSelector(
    (state) => state.comments?.commentsByTicket || {}
  );

  const loading = useSelector((state) => state.tickets.loading);
  const error = useSelector((state) => state.tickets.error);

  const [expanded, setExpanded] = useState(null);
  const [updateModal, setUpdateModal] = useState(null);

  useEffect(() => {
    dispatch(fetchAllTickets());
  }, [dispatch]);

  const toggleComments = (ticketId) => {
    if (expanded === ticketId) {
      setExpanded(null);
      return;
    }
    setExpanded(ticketId);
    dispatch(fetchCommentsByTicket(ticketId));
  };

  if (loading) return <h2>Loading tickets...</h2>;
  if (error) return <h2 style={{ color: "red" }}>{error}</h2>;

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard - All Tickets</h1>

      {tickets.length === 0 && (
        <p className="no-tickets">No tickets found.</p>
      )}

      <div className="admin-ticket-grid">
        {tickets.map((t) => {
          const comments = commentsByTicket[t.ticketId] || [];

          return (
            <div key={t.ticketId} className="admin-ticket-card">
              <h3>{t.title}</h3>
              <p>{t.description}</p>

              <div className="admin-meta">
                <span>
                  <strong>Status:</strong> {t.status}
                </span>
                <span>
                  <strong>Priority:</strong> {t.priority}
                </span>
                <span>
                  <strong>Created By:</strong> {t.createdBy}
                </span>
                <span>
                  <strong>Assigned To:</strong>{" "}
                  {t.assignedTo ?? "Unassigned"}
                </span>
              </div>

              <div className="admin-buttons">
                <button
                  className="admin-comment-toggle"
                  onClick={() => toggleComments(t.ticketId)}
                >
                  {expanded === t.ticketId ? "Hide Comments" : "Show Comments"}
                </button>

                <button
                  className="admin-update-btn"
                  onClick={() => setUpdateModal(t.ticketId)}
                >
                  Update Ticket
                </button>
              </div>

              {expanded === t.ticketId && (
                <div className="admin-comments-box">
                  <h4>Comments</h4>

                  {comments.length === 0 ? (
                    <p>No comments yet.</p>
                  ) : (
                    comments.map((c) => (
                      <div key={c.commentId} className="admin-comment-item">
                        <p>{c.message}</p>
                        <span>
                          {new Date(c.createdDate).toLocaleString()}
                        </span>
                      </div>
                    ))
                  )}

                  <AddComment ticketId={t.ticketId} />
                </div>
              )}

              {updateModal === t.ticketId && (
                <UpdateTicket ticket={t} onClose={() => setUpdateModal(null)} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
