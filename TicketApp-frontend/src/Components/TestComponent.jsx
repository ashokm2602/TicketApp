// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchUsers } from "../Features/UserSlice"; 
// import { fetchTickets } from "../Features/TicketSlice";
// import { fetchCommentsByTicket } from "../Features/CommentSlice";

// export default function TestDashboard() {
//   const dispatch = useDispatch();

//   const users = useSelector((s) => s.users.list);
//   const tickets = useSelector((s) => s.tickets.list);
//   const comments = useSelector((s) => s.comments.list);

//   useEffect(() => {
//     dispatch(fetchUsers());
//     dispatch(fetchTickets());
//     dispatch(fetchCommentsByTicket(1)); // fetch comments for ticketId=1
//   }, [dispatch]);

//   return (
//     <div>
//       <h1>TEST DASHBOARD</h1>

//       <h2>Users</h2>
//       <pre>{JSON.stringify(users, null, 2)}</pre>

//       <h2>Tickets</h2>
//       <pre>{JSON.stringify(tickets, null, 2)}</pre>

//       <h2>Comments (ticketId = 1)</h2>
//       <pre>{JSON.stringify(comments, null, 2)}</pre>
//     </div>
//   );
// }
