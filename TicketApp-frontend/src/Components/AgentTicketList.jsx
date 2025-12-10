import React, { useEffect, useState } from "react";
import TicketStatusUpdate from "./AgentStatusUpdate";
import TicketComments from "./TicketComments";
import "./AgentTicketList.css";

const AgentTicketList = () => {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);

    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const res = await fetch(
                    `https://localhost:7041/api/Tickets/agent/${userId}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                if (!res.ok) return;

                const data = await res.json();
                setTickets(data);
            } catch (error) {
                console.log("Error fetching tickets:", error);
            }
        };

        fetchTickets();
    }, [userId, token]);

    const toggleTicket = (ticket) => {
        // IF already opened → close it
        if (selectedTicket && selectedTicket.ticketId === ticket.ticketId) {
            setSelectedTicket(null);
        } 
        else {
            setSelectedTicket(ticket);
        }
    };

    return (
        <div className="ticket-list-container">
            <h3>Your Assigned Tickets</h3>

            <ul>
                {tickets.map((t) => (
                    <li key={t.ticketId}>
                        <strong>{t.title}</strong> (Status: {t.status})
                        <button onClick={() => toggleTicket(t)}>
                            {selectedTicket?.ticketId === t.ticketId ? "Hide" : "View"}
                        </button>
                    </li>
                ))}
            </ul>

            {selectedTicket && (
                <div className="ticket-details-box">
                    <h3>{selectedTicket.title}</h3>

                    <TicketStatusUpdate ticket={selectedTicket} />

                    <TicketComments ticketId={selectedTicket.ticketId} />
                </div>
            )}
        </div>
    );
};

export default AgentTicketList;
