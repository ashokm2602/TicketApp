import React from "react";
import TicketCard from "./TicketCard";
import { TicketStatus } from "../Services/TicketStatus";

export default function AgentDashboard({
  agent,
  tickets = [],
  users = [],
  onResolve,
  onComment,
}) {
  return (
    <main className="flex-1 min-h-screen bg-gray-50 p-8 overflow-y-auto">
      <div className="max-w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Welcome, {agent?.name}
          <span className="text-gray-500 text-lg"> — Your Assigned Tickets</span>
        </h1>

        {tickets.length === 0 && (
          <div className="text-gray-500 text-lg bg-white p-5 rounded-lg shadow">
            No tickets assigned.
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((t) => (
            <div
              key={t.ticketId}
              className="flex flex-col gap-4 bg-white p-4 rounded-lg shadow"
            >
              {/* Pass users for name resolving */}
              <TicketCard ticket={t} users={users} />

              {/* FIXED BUTTON */}
              {t.status !== "Resolved" && (
                <button
                  onClick={() => onResolve(t.ticketId,TicketStatus.RESOLVED)}   // <-- ONLY pass ID
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-sm"
                >
                  Mark as Resolved
                </button>
              )}

              {/* Comment box */}
              <textarea
                className="w-full border border-gray-300 rounded-md p-2 text-sm resize-none"
                placeholder="Add a comment and press Enter..."
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.target.value.trim()) {
                    e.preventDefault();
                    onComment(t.ticketId, e.target.value.trim());
                    e.target.value = "";
                  }
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
