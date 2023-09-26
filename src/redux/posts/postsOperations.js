import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../../firebase/config";

export const addPost = createAsyncThunk(
  "posts/addPost",
  async (data, thunkAPI) => {
    try {
      const docRef = await addDoc(collection(FIRESTORE_DB, "posts"), {
        ...data,
      });

      const Docs = await getDocs(collection(FIRESTORE_DB, "posts"));
      const response = [];
      Docs.forEach((doc) => {
        response.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }
);

export const postList = createAsyncThunk(
  "posts/postList",
  async (_, thunkAPI) => {
    try {
      const Docs = await getDocs(collection(FIRESTORE_DB, "posts"));
      const response = [];
      Docs.forEach((doc) => {
        response.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      return response;
    } catch (error) {
      console.log(error);
    }
  }
);
