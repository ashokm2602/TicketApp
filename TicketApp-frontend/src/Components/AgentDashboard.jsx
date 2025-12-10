import React from "react";
import AgentTicketList from "./AgentTicketList";
import "./AgentDashboard.css";

const AgentDashboard = () => {
  const username = localStorage.getItem("username");

  return (
   <div className="agent-dashboard-container">
  <div className="agent-dashboard-wrapper">
    <h2>Welcome...</h2>
    <AgentTicketList />
  </div>
</div>

  );
};

export default AgentDashboard;
