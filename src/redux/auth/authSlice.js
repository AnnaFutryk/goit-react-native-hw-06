import { createSlice } from "@reduxjs/toolkit";
import { signUp, signIn, logOut } from "./authOperations";

const initialState = {
  name: "",
  email: "",
  avatar: "",
  isAuth: false,
  error: null,
  loading: false,
};

const authSlise = createSlice({
  name: "auth",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (store) => {
        store.error = null;
        store.loading = true;
      })
      .addCase(signUp.fulfilled, (store, { payload }) => {
        const { email, displayName, photoURL } = payload;
        store.name = displayName;
        store.email = email;
        store.avatar = photoURL;
        store.error = null;
        store.loading = false;
        store.isAuth = true;
      })
      .addCase(signUp.rejected, (store, { payload }) => {
        store.error = payload;
        store.loading = false;
        store.isAuth = false;
      })
      .addCase(signIn.pending, (store) => {
        store.error = null;
        store.loading = true;
      })
      .addCase(signIn.fulfilled, (store, { payload }) => {
        const { email, displayName, profilePicture } = payload;
        store.name = displayName;
        store.email = email;
        store.avatar = profilePicture;
        store.error = null;
        store.loading = false;
        store.isAuth = true;
      })
      .addCase(signIn.rejected, (store, { payload }) => {
        store.error = payload;
        store.loading = false;
        store.isAuth = false;
      })
      .addCase(logOut.pending, (store) => {
        store.error = null;
        store.loading = true;
      })
      .addCase(logOut.fulfilled, (store) => {
        store.name = "";
        store.email = "";
        store.error = null;
        store.loading = false;
        store.isAuth = false;
      })
      .addCase(logOut.rejected, (store, { payload }) => {
        store.error = payload;
        store.loading = false;
        store.isAuth = true;
      });
  },
});

export default authSlise.reducer;
