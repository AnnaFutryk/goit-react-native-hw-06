import { createSlice } from "@reduxjs/toolkit";
import { fetchUserComments, fetchAddedComment } from "./commentsOperations";

const initialState = {
  uid: "",
  postId: "",
  comments: [],
  error: null,
  loading: false,
};

const commentsSlice = createSlice({
  name: "comments",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserComments.pending, (store) => {
        store.error = null;
        store.loading = true;
      })
      .addCase(fetchUserComments.fulfilled, (store, { payload }) => {
        store.comments = payload;
        store.uid = payload.uid;
        store.postId = payload.postId;
        store.error = null;
        store.loading = false;
      })
      .addCase(fetchUserComments.rejected, (store, { payload }) => {
        store.error = payload;
        store.loading = false;
      })
      .addCase(fetchAddedComment.pending, (store) => {
        store.error = null;
        store.loading = true;
      })
      .addCase(fetchAddedComment.fulfilled, (store, { payload }) => {
        store.comments = payload;
        store.uid = payload.uid;
        store.postId = payload.postId;
        store.error = null;
        store.loading = false;
      })
      .addCase(fetchAddedComment.rejected, (store, { payload }) => {
        store.error = payload;
        store.loading = false;
      });
  },
});

export default commentsSlice.reducer;
