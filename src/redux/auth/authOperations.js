import { createAsyncThunk } from "@reduxjs/toolkit";
import { FIREBASE_AUTH } from "../../firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
  //   onAuthStateChanged,
} from "firebase/auth";

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
