export const selectUser = (store) => store.auth;
export const selectUserAvatar = (store) => store.auth.avatar;
export const selectUpdatedAvatar = (store) => store.auth.updatedAvatar;
export const selectIsAuth = (store) => store.auth.isAuth;
export const selectIsLoading = (store) => store.auth.loading;
export const selectUserId = (store) => store.auth.userId;
export const selectUserName = (store) => store.auth.name;
