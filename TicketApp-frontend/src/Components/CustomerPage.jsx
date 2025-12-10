import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchTicketsByClient } from "../Features/TicketSlice";
import CreateTicketForm from "./CreateTicketForm";
import TicketList from "./TicketList";
import "./CustomerPage.css";

export default function CustomerPage() {
  const dispatch = useDispatch();
  const rawUserId = localStorage.getItem("userId");
  const userId = rawUserId ? Number(rawUserId) : null;

  useEffect(() => {
    if (!userId) return;

    const role = localStorage.getItem("role");
    if (role === "Customer") {
      dispatch(fetchTicketsByClient(userId));
    }
  }, [dispatch, userId]);

  return (
    <div className="customer-page">
      <h1>Customer Support Panel</h1>

      <CreateTicketForm />

      <h2>Your Raised Tickets</h2>

      <TicketList />
    </div>
  );
}
