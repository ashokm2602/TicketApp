import React, { useEffect, useState } from "react";
import api from "../api";
import { useDispatch } from "react-redux";
import { updateTicket } from "../Features/TicketSlice";
import "./UpdateTicket.css";

export default function UpdateTicket({ ticket, onClose }) {
    const dispatch = useDispatch();
    const [agents, setAgents] = useState([]);
    const [assignedTo, setAssignedTo] = useState(ticket.assignedTo || "");

    // Fetch SupportAgents using existing endpoint
    useEffect(() => {
        const fetchAgents = async () => {
            try {
                const res = await api.get("/Users/role/?role=SupportAgent");
                setAgents(res.data);
            } catch (err) {
                console.error("Error loading agents:", err);
            }
        };
        fetchAgents();
    }, []);

    const handleUpdate = () => {
        dispatch(
            updateTicket({
                id: ticket.ticketId,
                ticket: { ...ticket, assignedTo },
            })
        );
        onClose();
    };

    return (
        <div className="update-overlay">
            <div className="update-modal">
                <h2>Update Ticket</h2>

                <div className="update-field">
                    <label>Assign To:</label>
                    <select
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                    >
                        <option value="">-- Select Agent --</option>
                        {agents.map((u) => (
                            <option key={u.userId} value={u.userId}>
                                {u.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="update-actions">
                    <button className="save-btn" onClick={handleUpdate}>
                        Save
                    </button>
                    <button className="cancel-btn" onClick={onClose}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}
