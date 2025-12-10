// 🔥 Updated App.jsx — Proper Routing + RequireAuth + Role-Based Dashboards
// This version integrates your Login.jsx and RequireAuth.jsx correctly.

import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./Components/Login";
import RequireAuth from "./Components/RequireAuth"
// Dashboards
import AdminDashboard from "./Real_Components/AdminDashboard";
import AgentDashboard from "./Real_Components/AgentDashboard";
import CustomerDashboard from "./Real_Components/CustomerDashboard";

// Redux-based container (acts as routing host for dashboards)
import SupportTicketFrontend from "./Real_Components/SupportTicketFrontend";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* ---------------- ADMIN ROUTE ---------------- */}
        <Route
          path="/admin"
          element={
            <RequireAuth allowedRoles={["Admin"]}>
              <SupportTicketFrontend forcedRole="Admin" />
            </RequireAuth>
          }
        />

        {/* ---------------- AGENT ROUTE ---------------- */}
        <Route
          path="/agent"
          element={
            <RequireAuth allowedRoles={["SupportAgent"]}>
              <SupportTicketFrontend forcedRole="Agent" />
            </RequireAuth>
          }
        />

        {/* -------------- CUSTOMER ROUTE -------------- */}
        <Route
          path="/customer"
          element={
            <RequireAuth allowedRoles={["Customer"]}>
              <SupportTicketFrontend forcedRole="Customer" />
            </RequireAuth>
          }
        />

        {/* Default Fallback */}
        <Route path="*" element={<Login />} />
      </Routes>
    </Router>
  );
}
