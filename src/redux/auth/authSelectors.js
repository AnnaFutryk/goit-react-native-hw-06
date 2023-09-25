export const selectUser = (store) => store.auth;

export const selectUserAvatar = (store) => store.auth.avatar;
export const selectIsAuth = (store) => store.auth.isAuth;
export const selectIsLoading = (store) => store.auth.loading;
