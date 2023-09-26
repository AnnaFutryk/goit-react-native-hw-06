import { createSlice } from "@reduxjs/toolkit";
import { addPost, postList } from "./postsOperations";

const initialState = {
  posts: [],
  error: null,
  loading: false,
};

const postsSlise = createSlice({
  name: "posts",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(addPost.pending, (store) => {
        store.error = null;
        store.loading = true;
      })
      .addCase(addPost.fulfilled, (store, { payload }) => {
        store.posts = payload;
        store.error = null;
        store.loading = false;
      })
      .addCase(addPost.rejected, (store, { payload }) => {
        store.error = payload;
        store.loading = false;
      })
      .addCase(postList.pending, (store) => {
        store.error = null;
        store.loading = true;
      })
      .addCase(postList.fulfilled, (store, { payload }) => {
        store.posts = payload;
        store.error = null;
        store.loading = false;
      })
      .addCase(postList.rejected, (store, { payload }) => {
        store.error = payload;
        store.loading = false;
      });
  },
});

export default postsSlise.reducer;
