import { deleteDoc, doc, setDoc } from "firebase/firestore";
import { FIRESTORE_DB } from "./config";

export const sendLike = async (id, userId, name, avatar) => {
  const likeId = userId;
  try {
    const docRef = doc(FIRESTORE_DB, "posts", id, "likes", likeId);
    await setDoc(docRef, {
      ownerId: userId,
      ownerName: name,
      ownerAvatar: avatar,
    });
    return docRef.id;
  } catch (error) {
    console.log(error);
  }
};

export const deleteLike = async (id, userId) => {
  try {
    const docRef = doc(FIRESTORE_DB, "posts", id, "likes", userId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error(error);
  }
};
