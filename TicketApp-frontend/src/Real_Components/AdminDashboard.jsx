// ⭐ AdminDashboard.jsx (TAILWINDCSS)
// Renders only the main content — Sidebar comes from SupportTicketFrontend

import React from "react";
import TicketCard from "./TicketCard";

export default function AdminDashboard({ agents = [], tickets = [], users = [], onAssign, onClose }) {
  
  // Unassigned = assignedTo null OR 0 AND not closed
  const unassigned = tickets.filter(
    (t) => (!t.assignedTo || t.assignedTo === 0) && t.status !== "Closed"
  );

  return (
    <main className="flex-1 min-h-screen bg-gray-50 p-8">
      <div className="max-w-full">

        {/* PAGE TITLE */}
        <h1 className="text-4xl font-extrabold text-gray-800 mb-8">Admin Dashboard</h1>

        {/* ==================== SUPPORT AGENTS ==================== */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Support Agents</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {agents.map((a) => (
              <div key={a.userId} className="bg-white rounded-lg shadow p-5">
                <h3 className="text-lg font-semibold text-gray-800">{a.name}</h3>

                <p className="text-sm text-gray-500 mt-2">
                  Assigned Tickets:{" "}
                  {tickets.filter((t) => t.assignedTo === a.userId).length}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== TICKETS BY AGENT ==================== */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Tickets by Agent</h2>

          {agents.map((a) => (
            <div key={a.userId} className="mb-8">
              <h3 className="text-xl font-medium text-gray-700 mb-4">{a.name}</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {tickets
                  .filter((t) => t.assignedTo === a.userId)
                  .map((t) => (
                    <TicketCard key={t.ticketId} ticket={t} users={users} />
                  ))}
              </div>
            </div>
          ))}
        </section>

        {/* ==================== UNASSIGNED TICKETS ==================== */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">Unassigned Tickets</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {unassigned.map((t) => (
              <div
                key={t.ticketId}
                className="bg-white rounded-lg shadow p-5 flex flex-col gap-4"
              >
                <TicketCard ticket={t} users={users} />

                {/* ASSIGN DROPDOWN */}
                <div className="mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assign to
                  </label>

                  <select
                    className="w-full border border-gray-300 rounded-md p-2"
                    onChange={(e) => onAssign(t.ticketId, Number(e.target.value))}
                  >
                    <option value="">Select agent</option>
                    {agents.map((a) => (
                      <option key={a.userId} value={a.userId}>
                        {a.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ==================== RESOLVED → CLOSE ==================== */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-6">
            Tickets Awaiting Closure
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tickets
              .filter((t) => t.status === "Resolved")
              .map((t) => (
                <div
                  key={t.ticketId}
                  className="bg-white rounded-lg shadow p-5 flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {t.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-2">
                      {t.description}
                    </p>
                  </div>

                  <button
                    onClick={() => onClose(t.ticketId)}
                    className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md"
                  >
                    Close Ticket
                  </button>
                </div>
              ))}
          </div>
        </section>
      </div>
    </main>
  );
}
