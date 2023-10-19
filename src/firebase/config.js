// Для роботи із firebase обовʼязково треба ініціалізувати проект
import { initializeApp } from "firebase/app";
// Функція для підключення авторизації в проект
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
// Функція для підключення бази даних у проект
import { getFirestore } from "firebase/firestore";
// Функція для підключення сховища файлів в проект
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyB36TkUa9UhDRBLozEK3t1eGCdveZ_0_oQ",
  authDomain: "goit-hw-06.firebaseapp.com",
  projectId: "goit-hw-06",
  storageBucket: "goit-hw-06.appspot.com",
  messagingSenderId: "212034478607",
  appId: "1:212034478607:web:e8f0bfdaff98e4ad78797a",
  measurementId: "G-VHWBF1K9EB",
};

const FIREBASE_APP = initializeApp(firebaseConfig);

export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIRESTORE_STORAGE = getStorage(FIREBASE_APP);
