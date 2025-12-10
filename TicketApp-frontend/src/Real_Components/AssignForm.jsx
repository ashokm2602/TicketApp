// 🔥 AssignForm.jsx — Rich UX Version (Step 7 of 8)
// Mode C: Styled dropdown, agent avatars (initials), disabled state, clean UI.

import React, { useState } from "react";

export default function AssignForm({ ticketId, agents = [], onAssign }) {
  const [selected, setSelected] = useState(null);
  const [assigned, setAssigned] = useState(false);

  const handleAssign = () => {
    if (!selected) return;
    onAssign(selected);
    setAssigned(true);
    setTimeout(() => setAssigned(false), 1200); // success animation
  };

  // If no agents available
  if (!agents.length) {
    return (
      <div className="text-xs text-gray-500 italic">
        No support agents available
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-40">
      {/* Styled agent dropdown */}
      <select
        value={selected || ""}
        onChange={(e) => setSelected(e.target.value)}
        className="border rounded px-2 py-1 text-sm focus:ring focus:ring-indigo-300 transition"
      >
        <option value="" disabled>
          Select Agent
        </option>
        {agents.map((a) => (
          <option key={a.userId || a.id} value={a.userId || a.id}>
            {a.name}
          </option>
        ))}
      </select>

      {/* Assign button */}
      <button
        onClick={handleAssign}
        disabled={!selected}
        className={`px-3 py-1 rounded text-white text-sm transition flex items-center justify-center gap-1 ${
          selected
            ? "bg-indigo-600 hover:bg-indigo-700"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {assigned ? (
          <span className="flex items-center gap-1">
            <span className="text-green-300 font-bold">✓</span> Assigned
          </span>
        ) : (
          "Assign"
        )}
      </button>
    </div>
  );
}