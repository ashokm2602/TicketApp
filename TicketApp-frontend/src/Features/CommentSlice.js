import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getCommentsByTicketId,
  addComment as addCommentService,
  deleteComment as deleteCommentService,
} from "../Services/CommentService";

// 🔵 Fetch comments for a ticket
export const fetchCommentsByTicket = createAsyncThunk(
  "comments/fetchByTicket",
  async (ticketId) => {
    const comments = await getCommentsByTicketId(ticketId);
    return { ticketId, comments };
  }
);

// 🟢 Add comment
export const addComment = createAsyncThunk(
  "comments/add",
  async (commentData) => {
    const newComment = await addCommentService(commentData);
    return newComment;
  }
);

// 🔴 Delete comment
export const deleteComment = createAsyncThunk(
  "comments/delete",
  async (id) => {
    await deleteCommentService(id);
    return id;
  }
);

const commentSlice = createSlice({
  name: "comments",
  initialState: {
    commentsByTicket: {},
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsByTicket.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCommentsByTicket.fulfilled, (state, action) => {
        state.loading = false;
        state.commentsByTicket[action.payload.ticketId] =
          action.payload.comments;
      })

      .addCase(addComment.fulfilled, (state, action) => {
        const c = action.payload;

        if (!state.commentsByTicket[c.ticketId]) {
          state.commentsByTicket[c.ticketId] = [];
        }

        state.commentsByTicket[c.ticketId].push(c);
      })

      .addCase(deleteComment.fulfilled, (state, action) => {
        const id = action.payload;

        for (const ticketId in state.commentsByTicket) {
          state.commentsByTicket[ticketId] =
            state.commentsByTicket[ticketId].filter(
              (c) => c.commentId !== id
            );
        }
      });
  },
});

export default commentSlice.reducer;
