import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTicketsByClient } from "../Features/TicketSlice";
import { fetchCommentsByTicket, addComment } from "../Features/CommentSlice";
import "./TicketList.css";

export default function TicketList() {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");

  const ticketsState = useSelector((state) => state.tickets);
  const commentsState = useSelector((state) => state.comments);

  const tickets = ticketsState?.clientTickets || [];
  const loading = ticketsState?.loading;
  const error = ticketsState?.error;

  const commentsByTicket = commentsState?.commentsByTicket || {};

  const [commentInput, setCommentInput] = useState({});
  const [expanded, setExpanded] = useState(null);

  // ENUM MAPS (numbers → names)
  const statusMap = {
    1: "Open",
    2: "In Progress",
    3: "Resolved",
    4: "Closed",
  };

  const priorityMap = {
    1: "Low",
    2: "Medium",
    3: "High",
    4: "Critical",
  };

  useEffect(() => {
    if (userId) dispatch(fetchTicketsByClient(userId));
  }, [dispatch, userId]);

  const toggleComments = (ticketId) => {
    if (expanded === ticketId) {
      setExpanded(null);
      return;
    }
    setExpanded(ticketId);
    dispatch(fetchCommentsByTicket(ticketId));
  };

  const submitComment = async (ticketId) => {
    const text = (commentInput[ticketId] || "").trim();
    if (!text) return;

    const result = await dispatch(
      addComment({
        ticketId,
        userId,
        message: text,
      })
    );

    if (!result.error) {
      setCommentInput((prev) => ({ ...prev, [ticketId]: "" }));
      dispatch(fetchCommentsByTicket(ticketId));
    }
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

            const statusName = typeof ticket.status === "number"
              ? statusMap[ticket.status]
              : ticket.status;

            const priorityName = typeof ticket.priority === "number"
              ? priorityMap[ticket.priority]
              : ticket.priority;

            return (
              <div key={ticket.ticketId} className="ticket-card">
                <h3>{ticket.title}</h3>
                <p>{ticket.description}</p>

                <div className="ticket-meta">
                  <span>Status:</span>
                  <span
                    className={
                      "ticket-status-pill " +
                      (statusName === "Open"
                        ? "ticket-status-open"
                        : "ticket-status-closed")
                    }
                  >
                    {statusName}
                  </span>

                  <span>Priority:</span>
                  <span
                    className={
                      "ticket-priority-pill " +
                      (priorityName === "Low"
                        ? "ticket-priority-low"
                        : priorityName === "Medium"
                        ? "ticket-priority-medium"
                        : "ticket-priority-high")
                    }
                  >
                    {priorityName}
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

                    <textarea
                      placeholder="Add a comment..."
                      value={commentInput[ticket.ticketId] || ""}
                      onChange={(e) =>
                        setCommentInput({
                          ...commentInput,
                          [ticket.ticketId]: e.target.value,
                        })
                      }
                      className="comment-textarea"
                    />

                    <button
                      onClick={() => submitComment(ticket.ticketId)}
                      className="add-comment-btn"
                    >
                      Submit
                    </button>
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
