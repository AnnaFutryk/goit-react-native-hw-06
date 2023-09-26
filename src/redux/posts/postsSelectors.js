export const selectUserPosts = (store) => {
  const userUid = store.auth.uid;
  return store.posts.posts.filter((post) => post.uid === userUid);
};
