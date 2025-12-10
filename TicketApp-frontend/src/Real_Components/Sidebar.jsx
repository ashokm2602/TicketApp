// ⭐ Sidebar.jsx (TAILWINDCSS VERSION)
// Clean, modern sidebar for Admin / Agent / Customer — NO external CSS

import React from "react";
import { useNavigate } from "react-router-dom";

export default function Sidebar({ role }) {
  const navigate = useNavigate();

  const menu = {
    Admin: [
      { label: "Dashboard", route: "/admin" },
      { label: "All Tickets", route: "/admin" },
      { label: "Support Agents", route: "/admin" },
    ],
    SupportAgent: [
      { label: "My Tickets", route: "/agent" },
      { label: "Resolved Tickets", route: "/agent" },
    ],
     Agent: [
      { label: "My Tickets", route: "/agent" },
      { label: "Resolved Tickets", route: "/agent" },
    ],
    Customer: [
      { label: "My Tickets", route: "/customer" },
      { label: "Create Ticket", route: "/customer" },
    ],
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="w-64 min-h-screen bg-indigo-700 text-white flex flex-col p-6 shadow-lg">
      {/* Title */}
      <h2 className="text-2xl font-bold mb-6">Menu</h2>

      {/* Menu Buttons */}
      <nav className="flex flex-col gap-3 flex-grow">
        {menu[role]?.map((item) => (
          <button
            key={item.label}
            className="text-left px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 transition font-medium"
            onClick={() => navigate(item.route)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <button
        className="mt-auto bg-red-600 hover:bg-red-700 text-white py-2 rounded-md font-semibold transition"
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}