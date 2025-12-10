import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCommentsByTicket } from "../Features/CommentSlice";
import AddComment from "./AddAgentComment";
import "./TicketComments.css";

const TicketComments = ({ ticketId }) => {
    const dispatch = useDispatch();
    const { commentsByTicket, loading } = useSelector((state) => state.comments);

    // Load comments when ticketId changes
    useEffect(() => {
        if (ticketId) {
            dispatch(fetchCommentsByTicket(ticketId));
        }
    }, [ticketId, dispatch]);

    if (!ticketId) return <p>No ticket selected</p>;
    if (loading) return <p>Loading comments...</p>;

    const comments = commentsByTicket[ticketId] || [];

    return (
        <div className="comments-box">
            <h4>Comments</h4>

            {comments.length === 0 ? (
                <p>No comments yet.</p>
            ) : (
                comments.map((c) => (
                    <div key={c.commentId} className="comment-item">
                        <p>{c.message}</p>
                        <small>{new Date(c.createdDate).toLocaleString()}</small>
                    </div>
                ))
            )}

            {/* Add Comment Input */}
            <AddComment ticketId={ticketId} />
        </div>
    );
};

export default TicketComments;
