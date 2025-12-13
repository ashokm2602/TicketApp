import React from "react";

export default function TicketCard({ ticket, users }) {
  // Resolve CreatedBy name
  const createdByUser = users?.find(
  u => Number(u.userId) === Number(ticket.createdBy)
);

const assignedUser = users?.find(
  u => Number(u.userId) === Number(ticket.assignedTo)
);

  const createdByName =
  users?.length === 0
    ? "Loading..."
    : createdByUser?.name ?? "Unknown User";

    console.log(createdByName);
    console.log(createdByUser);



  // Resolve AssignedTo name
  const assignedToName = assignedUser ? assignedUser.name : "Not Assigned";

  // Generate initial avatar
  const getInitials = (name) => {
    if (!name) return "?";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  // Status badge colors
  const statusColors = {
    Open: "bg-red-500",
    "InProgress": "bg-yellow-500",
    InProgress: "bg-yellow-500",
    Resolved: "bg-green-600",
    Closed: "bg-gray-600",
  };
  const formattedDate = ticket.createdDate
  ? new Date(ticket.createdDate).toLocaleString()
  : "N/A";

  console.log(`Created Date :${formattedDate}`);

  return (
    <div className="border rounded-xl p-5 bg-white shadow-sm hover:shadow-lg transition-transform hover:-translate-y-1 cursor-pointer">
      
      {/* TITLE + STATUS */}
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg text-gray-800">
          #{ticket.ticketId} — {ticket.title}
        </h3>

        <span
          className={`text-xs text-white px-3 py-1 rounded-full ${statusColors[ticket.status]}`}
        >
          {ticket.status}
        </span>
      </div>

      {/* DESCRIPTION */}
      <p className="text-gray-600 text-sm mt-3 leading-relaxed">
        {ticket.description}
      </p>

      {/* USER INFO */}
      <div className="mt-4 flex flex-col gap-2 text-sm">

        {/* CREATED BY */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-semibold">
            {getInitials(createdByName)}
          </div>
          <span className="text-gray-700">
            <span className="font-semibold">Created By:</span> {createdByName}
          </span>
        </div>

        {/* ASSIGNED TO */}
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full ${
              assignedUser ? "bg-green-600" : "bg-gray-400"
            } text-white flex items-center justify-center text-xs font-semibold`}
          >
            {assignedUser ? getInitials(assignedToName) : "NA"}
          </div>
          <span className="text-gray-700">
            <span className="font-semibold">Assigned To:</span>{" "}
            {assignedToName}
          </span>
        </div>
      </div>

      {/* CREATED DATE */}
      <div className="mt-4 text-xs text-gray-500">
        Created on: {formattedDate || "N/A"}
      </div>
    </div>
  );
}
