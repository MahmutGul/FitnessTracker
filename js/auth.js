import usersCloudUploadAndGet from "./users-cloud.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {
  getAuth,
  connectAuthEmulator,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  get,
  child,
  push,
  update,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";

export const firebaseConfig = {
  apiKey: "AIzaSyA_2nH5giSOx8HQ59H4Auf8G8SgphOjCTA",
  authDomain: "fitnesstracker-5113b.firebaseapp.com",
  databaseURL: "https://fitnesstracker-5113b-default-rtdb.firebaseio.com",
  projectId: "fitnesstracker-5113b",
  storageBucket: "fitnesstracker-5113b.appspot.com",
  messagingSenderId: "200129127506",
  appId: "1:200129127506:web:ca55124b930ba60830ab8b",
};
import { loadingIcon } from "./ui.js";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app);
export const dbRef = ref(getDatabase());
export function bodyLoadIcon(state) {
  state == true ? loadingIcon.style.display = "":loadingIcon.style.display = "none";
}