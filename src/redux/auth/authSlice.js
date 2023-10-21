import { createSlice } from "@reduxjs/toolkit";
import { signUp, signIn, logOut } from "./authOperations";

const initialState = {
  userId: "",
  name: "",
  email: "",
  avatar: "",
  updatedAvatar: "",
  isAuth: false,
  error: null,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateNewAvatarUrl: (store, action) => {
      store.avatar = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (store) => {
        store.error = null;
        store.loading = true;
      })
      .addCase(signUp.fulfilled, (store, { payload }) => {
        const { uid, email, displayName, photoURL } = payload;
        store.userId = uid;
        store.name = displayName;
        store.email = email;
        store.avatar = photoURL;
        store.updatedAvatar = photoURL;
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
        const { email, displayName, profilePicture, localId } = payload;
        store.userId = localId;
        store.name = displayName;
        store.email = email;
        store.avatar = profilePicture;
        store.updatedAvatar = profilePicture;
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
        store.userId = "";
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
export const { updateNewAvatarUrl } = authSlice.actions;

export default authSlice.reducer;
