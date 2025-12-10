import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api";
// --- THUNKS --- //

export const fetchUsers = createAsyncThunk("users/fetchAll", async () => {
  const res = await api.get("/Users");
  return res.data;
});

export const fetchUserById = createAsyncThunk("users/fetchById", async (id) => {
  const res = await api.get(`/Users/GetUserById${id}`);
  return res.data;
});

export const addUser = createAsyncThunk("users/add", async (user) => {
  const res = await api.post("/Users", user);
  return res.data;
});

export const updateUser = createAsyncThunk("users/update", async ({ id, data }) => {
  const res = await api.put(`/Users/UpdateUser${id}`, data);
  return res.data;
});

export const deleteUser = createAsyncThunk("users/delete", async (id) => {
  await api.delete(`/Users/DeleteUser${id}`);
  return id;
});

// --- SLICE --- //

const userSlice = createSlice({
  name: "users",
  initialState: {
    list: [],
    selected: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload; // NO MAPPING NEEDED
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch One
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.selected = action.payload;
      })

      // Add
      .addCase(addUser.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })

      // Update
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.list.findIndex((u) => u.userId === action.payload.userId);
        if (index !== -1) state.list[index] = action.payload;
      })

      // Delete
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.list = state.list.filter((u) => u.userId !== action.payload);
      });
  },
});

export default userSlice.reducer;
