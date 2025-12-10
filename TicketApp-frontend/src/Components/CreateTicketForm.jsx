import { useState } from "react";
import { useDispatch } from "react-redux";
import { createTicket } from "../Features/TicketSlice";

import "./CreateTicketForm.css";

export default function CreateTicketForm() {
    const dispatch = useDispatch();

    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [priority, setPriority] = useState("Low");
    const userId = localStorage.getItem("userId");

    // Map UI text → enum numbers expected by backend
   const priorityMap = {
    Low: 1,        // Tpriority.New
    Medium: 2,     // Tpriority.Assigned
    High: 3        // Tpriority.InProgress
};

const statusMap = {
    Low: 1,        // Tstatus.Low
    Medium: 2,
    High: 3,
    Critical: 4
};

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting ticket...", {
    Title: title,
    Description: desc,
    Priority: priorityMap[priority],
    Status: 1,
    CreatedBy: userId,
    AssignedTo: null
});

        dispatch(
    createTicket({
        Title: title,
        Description: desc,
        Priority: priorityMap[priority],
        Status: 1,   // Default → Low
        CreatedBy: userId,
        AssignedTo: null
    })


);


        setTitle("");
        setDesc("");
        setPriority("Low");
    };

    return (
        <form className="create-ticket-form" onSubmit={handleSubmit}>
            <h2>Create New Ticket</h2>

            <input
                type="text"
                placeholder="Enter Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />

            <textarea
                placeholder="Enter Description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                required
            />

            <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
            </select>

            <button type="submit">Submit Ticket</button>
        </form>
    );
}
