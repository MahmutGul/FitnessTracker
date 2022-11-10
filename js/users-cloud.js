import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-storage.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";

function usersCloudUploadAndGet(process, file, path) {
  const firebaseConfig = {
    apiKey: "AIzaSyA_2nH5giSOx8HQ59H4Auf8G8SgphOjCTA",
    authDomain: "fitnesstracker-5113b.firebaseapp.com",
    databaseURL: "https://fitnesstracker-5113b-default-rtdb.firebaseio.com",
    projectId: "fitnesstracker-5113b",
    storageBucket: "fitnesstracker-5113b.appspot.com",
    messagingSenderId: "200129127506",
    appId: "1:200129127506:web:ca55124b930ba60830ab8b",
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const fbstorage = getStorage(app);

  if (process == "GET") {
    return getDownloadURL(ref(fbstorage, path))
    .then((url) => {
      return url;
    })
    .catch((error) => {
      console.log(error);
    })
  } else {
    const storageRef = ref(fbstorage, path);
    return uploadBytes(storageRef, file);
  }
}

export default usersCloudUploadAndGet;
