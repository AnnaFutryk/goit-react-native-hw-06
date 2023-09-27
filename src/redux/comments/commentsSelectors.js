export const selectUserComments = (store, postId) => {
  const userUid = store.auth.uid;
  return store.comments.comments.filter(
    (comment) => comment.uid === userUid && comment.postId === postId
  );
};
