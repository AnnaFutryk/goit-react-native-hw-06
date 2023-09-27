import { configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authSlice from "./auth/authSlice";
import postsSlice from "./posts/postsSlice";
import commentsSlice from "./comments/commentsSlice";

const persistConfig = {
  key: "auth",
  storage: AsyncStorage,
};

const postsPersistConfig = {
  key: "posts",
  storage: AsyncStorage,
};

const commentsPersistConfig = {
  key: "comments",
  storage: AsyncStorage,
};

export const store = configureStore({
  reducer: {
    auth: persistReducer(persistConfig, authSlice),
    posts: postsSlice,
    comments: commentsSlice,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

//створення стора, який зберігає стан при перезавантаженні
export const persistor = persistStore(store);

export const postsPersistor = persistStore(store, null, () => {
  //можна додати логіку
});

export const commentsPersistor = persistStore(store);
