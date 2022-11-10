import {
  savedUserEmail,
  logoutNav,
  loginNav,
  registerNav,
  userName,
  usernameNav,
  sendVerificationAgain,
  savedUserPass,
  userFirstName,
  userLastName,
  profilePictureNav,
  profilePictureEdit,
  userFullnameProfile,
  profileUsername,
} from "./ui.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
  sendEmailVerification,
  signInWithEmailAndPassword,
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
import usersCloudUploadAndGet from "./users-cloud.js";

(function () {
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

  function getUserDbInfo(value) {
    return get(child(dbRef, `users/${auth.currentUser.uid}`))
      .then((snapshot) => {
        const response = snapshot.val();
        if (snapshot.exists()) {
          if (Array.isArray(value)) {
            const res = [];
            value.forEach((a) => {
              res.push(response[a]);
            });
            return res;
          } else {
            return response[value];
          }
          return response[value];
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  var checked = false;
  async function onAuthStateChange() {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        document.body.setAttribute("user-loggedin", true);
        usernameNav ? (usernameNav.innerHTML = user.displayName) : "";
        user.emailVerified == false ? signOut(auth) : "";

        if (user.emailVerified == false && savedUserEmail) {
        } else if (user.emailVerified == false && !savedUserEmail) {
          signOut(auth);
        } else if (user.emailVerified == true) {
          if (
            location.pathname == "/signup.html" ||
            location.pathname == "/verify.html"
          ) {
            location.pathname = "/myprofile.html";
          }
          if (location.pathname == "/login.html") {
            location.pathname = "/";
          }
          logoutNav ? (logoutNav.forEach(a => a.style.display = "")) : "";
          if (location.pathname == "/myprofile.html") {
            user.displayName ? (userName.value = user.displayName) : "";
            (async () => {
              document.getElementById("loading-icon").style.display = "block";
              var loading = true;
              do {
                await getUserDbInfo(["firstname", "lastname", "username"])
                  .then((a) => {
                    if (a) {
                      a ? (userFirstName.value = a[0]) : "";
                      a ? (userLastName.value = a[1]) : "";
                      a[0] == undefined ? userFirstName.value = "":"";
                      a[1] == undefined ? userLastName.value = "":"";
                      userFullnameProfile.innerHTML = userFirstName.value + " " + userLastName.value;
                      profileUsername
                        ? (profileUsername.innerHTML = `@${a[2]}`)
                        : "";
                      document.getElementById("loading-icon").style.display =
                        "none";
                      loading = false;
                    }
                  })
                  .catch((err) => {
                    console.log(err);
                    loading = true;
                  });
              } while (loading);
            })();
          }
          if (user.photoURL) {
            document.getElementById(
              "profile-picture-nav"
            ).style.backgroundImage = `url("${user.photoURL}")`;
          }
          usersCloudUploadAndGet(
            "GET",
            "",
            `images/${auth.currentUser.uid}/profile_picture.jpg`
          )
            .then((response) => {
              if (response) {
                profilePictureNav
                  ? (profilePictureNav.style.backgroundImage = `url(${response})`)
                  : "";
                profilePictureEdit
                  ? (profilePictureEdit.style.backgroundImage = `url(${response})`)
                  : "";
              }
            })
            .catch((err) => {
              profilePictureNav.style.backgroundImage = ``;
            });
        }
        var noError;
        for (let i = 0; i < 5; i++) {
          get(child(dbRef, `usersprogress/${auth.currentUser.uid}`))
            .then((snapshot) => {
              noError = true;
              const response = snapshot.val();
              if (snapshot.exists()) {
                document.getElementById("totalScore").innerHTML = response.totalScore;
              }
            })
            .catch((error) => {
              console.log(error);
            });
          if (noError == true) {
            break;
          }
        }
      } else {
        document.body.setAttribute("user-loggedin", false);
        if (location.pathname == "/myprofile.html" || location.pathname == "/create-a-plan.html" || location.pathname == "/my-plans.html") {
          location.pathname = "/login.html";
        }
        if (location.pathname == "/verify.html" && !savedUserEmail) {
          location.pathname = "login.html";
        } else if (location.pathname == "/verify.html" && savedUserEmail) {
          if (checked != true) {
            checked = true;
            signInWithEmailAndPassword(
              auth,
              savedUserEmail,
              savedUserPass
            ).then(() => {
              if (!auth.currentUser.emailVerified) {
                signOut(auth);
              } else if (auth.currentUser.emailVerified == true) {
                location.pathname = "/myprofile.html";
              }
            });
          }
          sendVerificationAgain.onclick = async () => {
            const userCredential = await signInWithEmailAndPassword(
              auth,
              savedUserEmail,
              savedUserPass
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
        }
      }
    });
  }
  onAuthStateChange();
})();
