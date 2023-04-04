import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyBAnEELI3dzwkavTzFLj0xiOb2PQj5RQG0",
  authDomain: "react-native-go-it.firebaseapp.com",
  projectId: "react-native-go-it",
  storageBucket: "react-native-go-it.appspot.com",
  messagingSenderId: "537848122589",
  appId: "1:537848122589:web:bcff706b9ed9a88d19df34",
  measurementId: "G-V4MWMCDHZS",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const storage = getStorage(app);
const db = getFirestore(app);

const firebase = { auth, storage, db };

export default firebase;
