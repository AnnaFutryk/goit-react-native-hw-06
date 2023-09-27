import { createSlice } from "@reduxjs/toolkit";
import { fetchAddedPost, fetchUserPosts } from "./postsOperations";

const initialState = {
  uid: "",
  posts: [],
  selectedPostId: "",
  selectedPostImage: "",
  error: null,
  loading: false,
};

const postsSlise = createSlice({
  name: "posts",
  initialState,
  reducers: {
    selectPost: (store, action) => {
      const { postId, postImage } = action.payload;
      store.selectedPostId = postId;
      store.selectedPostImage = postImage;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAddedPost.pending, (store) => {
        store.error = null;
        store.loading = true;
      })
      .addCase(fetchAddedPost.fulfilled, (store, { payload }) => {
        store.posts = payload;
        store.error = null;
        store.loading = false;
      })
      .addCase(fetchAddedPost.rejected, (store, { payload }) => {
        store.error = payload;
        store.loading = false;
      })
      .addCase(fetchUserPosts.pending, (store) => {
        store.error = null;
        store.loading = true;
      })
      .addCase(fetchUserPosts.fulfilled, (store, { payload }) => {
        store.posts = payload;
        store.error = null;
        store.loading = false;
      })
      .addCase(fetchUserPosts.rejected, (store, { payload }) => {
        store.error = payload;
        store.loading = false;
      });
  },
});

export const { selectPost } = postsSlise.actions;

export default postsSlise.reducer;
