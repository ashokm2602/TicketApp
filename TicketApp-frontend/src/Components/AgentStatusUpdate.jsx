import React, { useState } from "react";
import axios from "axios";
import "./AgentStatusUpdate.css";

export default function AgentStatusUpdate({ ticket }) {

    const token = localStorage.getItem("token");

    // Convert backend enum number → frontend state
    const [status, setStatus] = useState(ticket.status);
    const [priority, setPriority] = useState(ticket.priority);

    const updateStatus = async () => {
        try {
            await axios.put(
                `https://localhost:7041/api/Tickets/${ticket.ticketId}`,
                {
                    title: ticket.title,
                    description: ticket.description,
                    priority: Number(priority), // ENUM number
                    status: Number(status),     // ENUM number
                    assignedTo: ticket.assignedTo,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            alert("Status updated successfully!");
        } catch (err) {
            console.log(err);
            alert("Failed to update. Check console.");
        }
    };

    return (
        <div className="status-update-box">
            <h4>Update Ticket</h4>

            <label>Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value={1}>Low</option>
                <option value={2}>Medium</option>
                <option value={3}>High</option>
                <option value={4}>Critical</option>
            </select>

            <label>Priority</label>
            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value={1}>New</option>
                <option value={2}>Assigned</option>
                <option value={3}>In Progress</option>
                <option value={4}>Closed</option>
            </select>

            <button onClick={updateStatus}>Save</button>
        </div>
    );
}
