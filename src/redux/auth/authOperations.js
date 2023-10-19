import { createAsyncThunk } from "@reduxjs/toolkit";
import { FIREBASE_AUTH, FIRESTORE_STORAGE } from "../../firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

const auth = FIREBASE_AUTH;

export const signUp = createAsyncThunk(
  "firebase/signUp",
  async (data, thunkAPI) => {
    try {
      const { email, password, login, avatar } = data;
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
        avatar
      );
      response &&
        (await updateProfile(auth.currentUser, {
          displayName: login,
          photoURL: avatar,
        }));
      return response.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(alert("Sign in failed:" + error.message));
    }
  }
);

export const signIn = createAsyncThunk(
  "firebase/signIn",
  async (data, thunkAPI) => {
    try {
      const { email, password } = data;
      const response = await signInWithEmailAndPassword(auth, email, password);
      return response._tokenResponse;
    } catch (error) {
      return thunkAPI.rejectWithValue(alert("Sign in failed:" + error.message));
    }
  }
);

export const logOut = createAsyncThunk(
  "firebase/logOut",
  async (_, thunkAPI) => {
    try {
      const response = await auth.signOut();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const updateUserAvatar = createAsyncThunk(
  "firebase/updateUserAvatar",
  async (data, thunkAPI) => {
    try {
      const { userId, newAvatarUrl } = data;

      const imageRef = ref(FIRESTORE_STORAGE, `avatars/${userId}`);
      await uploadBytes(imageRef, newAvatarUrl);

      const avatarUrl = await getDownloadURL(imageRef);

      await updateProfile(auth.currentUser, { photoURL: avatarUrl });
      console.log("updated");

      return avatarUrl;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        alert("Update user avatar failed: ", error.message)
      );
    }
  }
);
