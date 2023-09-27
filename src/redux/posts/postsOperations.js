import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../../firebase/config";

export const fetchAddedPost = createAsyncThunk(
  "posts/fetchAddedPost",
  async (data, thunkAPI) => {
    try {
      const docRef = await addDoc(collection(FIRESTORE_DB, "posts"), {
        ...data,
      });

      const Docs = await getDocs(collection(FIRESTORE_DB, "posts"));
      const posts = [];

      Docs.forEach((doc) => {
        posts.unshift({
          id: doc.id,
          ...doc.data(),
        });
      });
      return posts;
    } catch (error) {
      console.log(error);
    }
  }
);

export const fetchUserPosts = createAsyncThunk(
  "posts/fetchUserPosts",
  async (uid, thunkAPI) => {
    try {
      const q = query(
        collection(FIRESTORE_DB, "posts"),
        where("uid", "==", uid)
      );
      const querySnapshot = await getDocs(q);

      const userPosts = [];
      querySnapshot.forEach((doc) => {
        userPosts.unshift({
          id: doc.id,
          ...doc.data(),
        });
      });

      return userPosts;
    } catch (error) {
      console.log(error);
    }
  }
);
