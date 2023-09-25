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

const persistConfig = {
  key: "auth",
  storage: AsyncStorage,
};

export const store = configureStore({
  reducer: {
    auth: persistReducer(persistConfig, authSlice),
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
