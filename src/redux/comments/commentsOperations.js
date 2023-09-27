import { createAsyncThunk } from "@reduxjs/toolkit";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "../../firebase/config";

export const fetchAddedComment = createAsyncThunk(
  "comments/fetchAddedComment",
  async ({ comment, uid, postId }, thunkAPI) => {
    try {
      await addDoc(collection(FIRESTORE_DB, "comments"), {
        comment,
        uid,
        postId,
      });

      const Docs = await getDocs(collection(FIRESTORE_DB, "comments"));
      const comments = [];

      Docs.forEach((doc) => {
        comments.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      return comments;
    } catch (error) {
      console.log(error);
    }
  }
);

export const fetchUserComments = createAsyncThunk(
  "comments/fetchUserComments",
  async (data, thunkAPI) => {
    try {
      const { postId, uid } = data;
      const q = query(
        collection(FIRESTORE_DB, "comments"),
        where("uid", "==", uid),
        where("postId", "==", postId)
      );
      const querySnapshot = await getDocs(q);

      const userComments = [];
      querySnapshot.forEach((doc) => {
        userComments.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      return userComments;
    } catch (error) {
      console.log(error);
    }
  }
);
