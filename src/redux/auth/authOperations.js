import { createAsyncThunk } from "@reduxjs/toolkit";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebase/config";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, updateDoc } from "firebase/firestore";

const auth = FIREBASE_AUTH;

export const signUp = createAsyncThunk(
  "firebase/signUp",
  async (data, thunkAPI) => {
    try {
      const { email, password, login, avatar } = data;
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (response) {
        const user = auth.currentUser;
        if (user) {
          // Створити документ користувача в Firestore
          const userRef = doc(FIRESTORE_DB, "users", user.uid);
          await setDoc(userRef, {
            login,
            avatar,
          });

          // Оновити профіль користувача в Firebase Auth
          await updateProfile(user, {
            displayName: login,
            photoURL: avatar,
          });
        }

        return response.user;
      }
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

export const updateUserProfile = async (userId, avatarUrl) => {
  const userRef = doc(FIRESTORE_DB, "users", userId);
  try {
    await updateDoc(userRef, {
      avatar: avatarUrl,
    });
    console.log("Профіль користувача успішно оновлено в Firestore");
  } catch (error) {
    console.error("Помилка при оновленні профілю користувача: ", error);
  }
};

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
