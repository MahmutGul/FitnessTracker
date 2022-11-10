import {
  usernameState,
  errorMessage,
  loginForm,
  signupForm,
  userPass,
  userCPass,
  userEmail,
  userName,
  logoutNav,
  rememberInput,
  sendVerificationAgain,
  editProfileFrom,
  userFirstName,
  userLastName,
  savedUserEmail,
  savedUserPass,
  profilePicture,
  profilePictureNav,
  loadingIcon,
  profilePictureEdit,
  profileUsername,
  userFullnameProfile
} from "./ui.js";
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

function Users() {
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
  const db = getDatabase(app);
  const dbRef = ref(getDatabase());

  function UsererrorMessage(error) {
    if (error.code == "auth/wrong-password") {
      errorMessage.innerHTML = "Wrong password. Try again.";
    } else if (error.code == "auth/invalid-email") {
      errorMessage.innerHTML = "Please enter a valid email address.";
    } else if (error.code == "auth/user-not-found") {
      errorMessage.innerHTML =
        "The email that you've entered doesn't belong to an account. Please check your email and try again.";
    } else if (error.code == "auth/email-already-in-use") {
      errorMessage.innerHTML = "Account exist!";
    } else if (error.code == "auth/missing-email") {
      errorMessage.innerHTML = "Account not found!";
    } else {
      errorMessage.innerHTML = `${error.message}`;
    }
    setTimeout(() => {
      errorMessage.innerHTML = "";
    }, 3000);
  }
  function rememberLogin(rememberInput, username, userpass) {
    localStorage.removeItem("useremail", username);
    localStorage.removeItem("userpass", userpass);
    sessionStorage.removeItem("useremail", username);
    sessionStorage.removeItem("userpass", userpass);
    if (rememberInput == true) {
      localStorage.setItem("useremail", username);
      localStorage.setItem("userpass", userpass);
    } else {
      sessionStorage.setItem("useremail", username);
      sessionStorage.setItem("userpass", userpass);
    }
    if (rememberInput == "delete") {
      localStorage.removeItem("useremail", username);
      localStorage.removeItem("userpass", userpass);
      sessionStorage.removeItem("useremail", username);
      sessionStorage.removeItem("userpass", userpass);
    }
  }

  function checkUserNameAvailability(userName) {
    return get(child(dbRef, `usernames/`))
      .then((snapshot) => {
        const response = snapshot.val();
        if (snapshot.exists()) {
          const usernames = [];
          for (let data in response) {
            usernames.push(response[data].username.toLowerCase());
          }
          return !usernames.includes(userName.toLowerCase());
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
  function checkIfIsEmail(e) {
    if (
      e.match(
        /(?:\s|^)(?![a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)\S+\b(?=\s|$)/gi
      )
    ) {
      return false;
    } else {
      return true;
    }
  }

  function checkUsernameEmail(userName) {
    userName = userName.toLowerCase();
    if (checkIfIsEmail(userName)) {
      return userName;
    } else {
      return get(child(dbRef, `usernames/`))
        .then((snapshot) => {
          const response = snapshot.val();
          if (snapshot.exists()) {
            const userEmail = [];
            for (let data in response) {
              if (response[data].username == userName) {
                userEmail.push(response[data].useremail);
              }
            }
            console.log(userEmail[0]);
            return userEmail[0];
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }

  function addUserToDatabase(userEmail, userName, UID) {
    const userNames = {
      username: userName,
      useremail: userEmail,
    };
    const users = {
      username: userName,
      useremail: userEmail,
      uid: UID,
    };
    return (
      set(ref(db, `usernames/${UID}`), userNames),
      set(ref(db, `users/${UID}`), users)
    );
  }

  async function onAuthStateChange() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log(user);
      } else {
      }
    });
  }
  onAuthStateChange();

  async function loginEmailandPass() {
    const loginPass = userPass.value;
    const loginEmail = await checkUsernameEmail(userEmail.value);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        loginEmail,
        loginPass
      ).then(() => {
        rememberLogin(rememberInput, loginEmail, loginPass);
        if (auth.currentUser.emailVerified == false) {
          sendVerificationAgain.style.display = "";
          sendVerificationAgain.onclick = async () => {
            const userCredential = await signInWithEmailAndPassword(
              auth,
              loginEmail,
              loginPass
            ).then(() => {
              if (!auth.currentUser.emailVerified) {
                let sentAlert = document.getElementById("mailsentmessage");
                sentAlert.innerHTML = "";
                sendEmailVerification(auth.currentUser)
                  .then(() => {
                    sentAlert.style.opacity = 100;
                    sentAlert.innerHTML = "✅ Email sent";
                    sentAlert.style.visibility = "visible";
                    setTimeout(() => {
                      sentAlert.style.opacity = 0;
                      sentAlert.style.visibility = "hidden";
                    }, 4500);
                  })
                  .then(() => {
                    signOut(auth);
                  });
              } else {
                location.pathname = "/myprofile.html";
              }
            });
          };
          throw new Error("Please activate your account");
        }
      });
    } catch (error) {
      UsererrorMessage(error);
    }
  }

  async function signupEmailandPass() {
    const signupEmail = userEmail.value;
    const signupPass = userPass.value;
    const signupCPass = userCPass.value;
    const signupUserName = userName.value.toLowerCase();
    var exp = false;
    const checkUserName = await checkUserNameAvailability(signupUserName);
    try {
      if (signupCPass == signupPass && checkUserName) {
        rememberLogin(rememberInput, signupEmail, signupPass);
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          signupEmail,
          signupPass
        ).then(() => {
          document.querySelector("#full-screen-loading").style.display =
            "unset";
          if (auth.currentUser) {
            updateProfile(auth.currentUser, {
              displayName: signupUserName,
            });
            sendEmailVerification(auth.currentUser).then(() => {
              signInWithEmailAndPassword(auth, signupEmail, signupPass).then(
                () => {
                  addUserToDatabase(
                    signupEmail,
                    signupUserName,
                    auth.currentUser.uid
                  ).then(() => {
                    location.pathname = "/verify.html";
                  });
                }
              );
            });
          }
        });
      } else {
        if (checkUserName == false) {
          throw new Error("Username is not available");
        } else if (signupCPass != signupPass) {
          throw new Error("Password doesn't match");
        }
      }
    } catch (error) {
      UsererrorMessage(error);
      exp = true;
    }
  }

  async function logout() {
    await signOut(auth);
    location.pathname = "/login.html";
  } 

  async function updateUserInfo() {
    const username = userName.value.toLowerCase();
    const lastname = userLastName.value;
    const firstname = userFirstName.value;
    const UID = auth.currentUser.uid;
    const checkUserName = await checkUserNameAvailability(username);
    let userNames = {};
    let users = {};
    userNames.username = username;
    users.username = username;
    // users.photoURL = userimage;
    users.lastname = lastname;
    users.firstname = firstname;

    const updates = {};
    updates[`usernames/${UID}/username`] = username;
    updates[`users/${UID}/username`] = username;
    updates[`users/${UID}/firstname`] = firstname;
    updates[`users/${UID}/lastname`] = lastname;
    // updates[`users/${UID}/profile_picture`] = userimage;

    if (!checkUserName && username != auth.currentUser.displayName) {
      throw new Error("Username is not available");
    } else {
      loadingIcon.style.display = "unset";
      loadingIcon.style.backgroundColor = "#ffffffb0";
      if (profilePicture.files[0]) {
        const picUpload = await usersCloudUploadAndGet(
          "SET",
          profilePicture.files[0],
          `/images/${UID}/profile_picture.jpg`
        ).then(() => {
          usersCloudUploadAndGet(
            "GET",
            "",
            `images/${auth.currentUser.uid}/profile_picture.jpg`
          ).then((response) => {
            if (response) {
              profilePictureNav.style.backgroundImage = `url(${response})`;
              profilePictureEdit.style.backgroundImage = `url(${response})`;
              updates[`users/${UID}/profile_picture`] = response;
              update(ref(db), updates);
              updateProfile(auth.currentUser, {
                photoURL: response,
              });
            }
          });
        });
      }
      update(ref(db), updates);

      updateProfile(auth.currentUser, {
        displayName: username,
        // photoURL: userimage,
      }).then(() => {
        loadingIcon.style.display = "none";
        document.getElementById("message-span").style.opacity = 100;
        document.getElementById("message-span").innerHTML = "✅ Updated";
        document.getElementById("message-span").style.visibility = "visible";
        setTimeout(() => {
          document.getElementById("message-span").style.opacity = 0;
          document.getElementById("message-span").style.visibility = "hidden";
        }, 4500);
        userFullnameProfile.innerHTML = firstname + " " + lastname;
        profileUsername ? (profileUsername.innerHTML = `@${username}`) : "";
      });
    }
  }

  async function realTimeUsernameCheck() {
    const checkUserName = await checkUserNameAvailability(userName.value);

    if (
      auth.currentUser != null &&
      !checkUserName &&
      userName.value != auth.currentUser.displayName
    ) {
      usernameState.innerHTML = "✘ Unavailable";
      usernameState.style.color = "red";
    } else if (!checkUserName && auth.currentUser == null) {
      usernameState.innerHTML = "✘ Unavailable";
      usernameState.style.color = "red";
    } else {
      usernameState.innerHTML = "✔ Available";
      usernameState.style.color = "green";
    }
  }
  profilePicture ? profilePicture.addEventListener('change', function() {
    if (profilePicture.files.length != 0) {
      document.getElementById("submitImage").style.display = "";
    } else {
      document.getElementById("submitImage").style.display = "none";
    }
  }):"";
  profilePicture ? document.getElementById("submitImage").onclick = function () {
    document.querySelector("#edit_profile button").click();
    document.getElementById("submitImage").style.display = "none";
  }:"";

  userName ? userName.addEventListener("input", realTimeUsernameCheck) : "";
  editProfileFrom
    ? editProfileFrom.addEventListener("submit", () => {
        updateUserInfo().catch((error) => UsererrorMessage(error));
      })
    : "";
  logoutNav ? logoutNav.forEach(a => a.addEventListener("click", logout)) : "";
  loginForm ? loginForm.addEventListener("submit", loginEmailandPass) : "";
  signupForm ? signupForm.addEventListener("submit", signupEmailandPass) : "";
}
export default Users;
