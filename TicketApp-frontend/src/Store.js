import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./Features/UserSlice";
import ticketReducer from "./Features/TicketSlice";
import commentReducer from "./Features/CommentSlice";

const store = configureStore({
  reducer: {
    users: userReducer,
    tickets: ticketReducer,
    comments: commentReducer,
  },
});

export default store;   // ✔ this must exist
