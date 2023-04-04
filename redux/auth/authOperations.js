import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  signOut,
} from "firebase/auth";
import { authSlice } from "./authReducer";
import firebase from "../../firebase/config";

const { auth } = firebase;
const { updateUserProfile, authLogOut, authStateChange } = authSlice.actions;

export const authSignInUser =
  ({ email, password }) =>
  async (dispatch) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      const { uid, displayName, photoUrl } = auth.currentUser;

      dispatch(
        updateUserProfile({
          userId: uid,
          displayName,
          email,
          photoUrl,
        })
      );
    } catch (error) {
      const errorMessage = error.message;
      alert(errorMessage);
    }
  };

export const authSignUpUser =
  ({ email, password, displayName }) =>
  async (dispatch) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(auth.currentUser, { displayName });
      const { uid } = auth.currentUser;

      dispatch(
        updateUserProfile({
          userId: uid,
          displayName,
          email,
        })
      );
    } catch (error) {
      const errorMessage = error.message;
      alert(errorMessage);
    }
  };

export const authSignOutUser = () => async (dispatch) => {
  try {
    await signOut(auth);
    dispatch(authLogOut());
  } catch (error) {
    console.log("error", error.message);
  }
};

export const getUsersInfo = () => async (dispatch) => {
  await onAuthStateChanged(auth, (user) => {
    if (user) {
      const { uid, displayName, email } = user;
      dispatch(
        updateUserProfile({
          userId: uid,
          displayName,
          email,
        })
      );
      dispatch(authStateChange({ stateChange: true }));
    }
  });
};
