// ⭐ CustomerDashboard.jsx (TAILWINDCSS VERSION)
// Sidebar is rendered by SupportTicketFrontend — not inside this file
// Clean modern UI with TailwindCSS

import React from "react";
import TicketCard from "./TicketCard";
import CreateTicketForm from "./CreateTicketForm";
import { fetchAllTickets } from "../Features/TicketSlice";
import { fetchUsers } from "../Features/UserSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

export default function CustomerDashboard({ customer, tickets = [], users =[],onCreate, onComment }) {
  const dispatch = useDispatch();
  useEffect(() => {
  dispatch(fetchUsers());
  dispatch(fetchAllTickets());
}, [dispatch]);


  return (
    <main className="flex-1 min-h-screen bg-gray-50 p-8">
      <div className="max-w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Welcome, {customer?.name}
        </h1>

        {/* CREATE TICKET */}
        <section className="mb-12 bg-white shadow p-6 rounded-lg">
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">
            Create a Support Ticket
          </h2>
          <CreateTicketForm onCreate={onCreate} />
        </section>

        {/* USER TICKETS */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-gray-700">Your Tickets</h2>

          {tickets.length === 0 && (
            <div className="text-gray-600 text-lg bg-white p-5 rounded-lg shadow">
              You haven't raised any tickets yet.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {tickets.map((t) => (
              <div key={t.ticketId} className="flex flex-col gap-4">
                <TicketCard ticket={t} users = {users} />

                {/* Comment Box */}
                <textarea
                  className="w-full border border-gray-300 rounded-md p-2 text-sm"
                  placeholder="Add a comment..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.target.value.trim()) {
                      onComment(t.ticketId, e.target.value.trim());
                      e.target.value = "";
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
