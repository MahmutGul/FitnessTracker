import readyPlans from "./readyPlans.js";
import {
  customPlanForm,
  customPlanSwitch,
  readyPlan,
  planType,
  customPlanName,
  customExercises,
  customPlanSubmit,
  planInfInputs,
} from "./ui.js";
import {
  getDatabase,
  ref,
  set,
  get,
  child,
  push,
  update,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import errormsg from "./error.js";

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
const user = auth.currentUser;
const db = getDatabase(app);
const dbRef = ref(getDatabase());

async function addPlanToDb(UID, res, planName) {
  var exist = false;
  var active = false;
  await get(child(dbRef, `usersplans/${UID}/${planName}`))
    .then((snapshot) => {
      const response = snapshot.val();
      if (snapshot.exists()) {
        exist = true;
      }
    })
    .catch((error) => {
      console.error(error);
    });
  await get(child(dbRef, `usersplans/${UID}`))
    .then((snapshot) => {
      const response = snapshot.val();
      if (snapshot.exists()) {
        for (let data in response) {
          if (response[data].active) {
            active = true;
          }
        }
      }
    })
    .catch((error) => {
      console.error(error);
    });
  if (!exist) {
    const db = getDatabase();
    !active ? res[planName].active = true:"";
    update(ref(db, "usersplans/" + UID), res).then(() => {
      location.pathname = "/my-plans.html";
    });
  } else {
    throw new Error("The plan is already exist");
  }
}

function createPlan() {
  var res;
  planInfInputs
    ? planInfInputs.forEach((e) => {
        e.addEventListener("change", function () {
          customPlanRtn();
        });
      })
    : "";
  customPlanSwitch
    ? customPlanSwitch.addEventListener("change", function () {
        customPlanRtn();
      })
    : "";
  document.querySelectorAll("input").forEach((e) => {
    e.addEventListener('change', () => {
      customPlans();
    });
  })

  customPlanRtn();
  function customPlanRtn() {
    const planType = document.querySelector("#plan-type input:checked");
    const muscleGain = document.querySelectorAll(".muscle-gain-plan");
    const fatLose = document.querySelectorAll(".fat-lose-plan");
    const exerciseDays = document.querySelectorAll(
      "#exercise-days input:checked"
    );

    customPlanSwitch.checked
      ? (customPlanForm.style.display = "")
      : (customPlanForm.style.display = "none");

    function displayMuscleGain(hideOther) {
      muscleGain.forEach((e) => {
        e.style.display = "";
      });
      hideOther
        ? fatLose.forEach((e) => {
            e.style.display = "none";
          })
        : "";
    }
    function displayFatLose(hideOther) {
      fatLose.forEach((e) => {
        e.style.display = "";
      });
      hideOther
        ? muscleGain.forEach((e) => {
            e.style.display = "none";
          })
        : "";
    }

    if (planType.value == "fat-lose") {
      displayFatLose(true);
    } else if (planType.value == "muscle-gain") {
      displayMuscleGain(true);
    } else {
      displayMuscleGain();
      displayFatLose();
    }

    showExerciseDays();
    function showExerciseDays() {
      document.querySelectorAll(".exercise-day").forEach((e) => {
        e.style.display = "none";
      });
      exerciseDays.forEach((e) => {
        document.getElementById(e.value).style.display = "";
      });
    }
  }
  readyMadePlans();
  function readyMadePlans() {
    readyPlan.forEach((e) => {
      const daysCount = e.getAttribute("dayscount");
      const inps = e.querySelectorAll("input");
      const selectPlanButton = e.querySelector(".select-plan");
      const planName = e.getAttribute("id");
      inps.forEach((x) => {
        x.addEventListener("change", function () {
          const checkedInps = e.querySelectorAll("input:checked");
          const notCheckedInps = e.querySelectorAll("input:not(:checked)");
          const selectedDays = [];
          checkedInps.forEach((days) => {
            selectedDays.push(days.getAttribute("name"));
          });
          if (checkedInps.length == daysCount) {
            notCheckedInps.forEach((nc) => {
              nc.parentElement.style.display = "none";
            });
            selectPlanButton.style.display = "";
            selectPlanButton.onclick = function () {
              res = readyPlans(planName, selectedDays);
              onAuthStateChanged(auth, (user) => {
                if (user) {
                  const UID = user.uid;
                  addPlanToDb(UID, res, planName).catch((error) => {
                    console.log(error);
                    errormsg(error.message);
                  });
                } else {
                }
              });
            };
          } else {
            inps.forEach((ch) => {
              ch.parentElement.style.display = "";
              selectPlanButton.style.display = "none";
            });
          }
        });
      });
    });
  }
  customPlans();
  function customPlans() {
    const planTypeArray = [];
    const plan = {};
    class CustomPlans {
      constructor(name, days) {
        this[name] = {
          plan: {
            ...days,
          },
        };
      }
    }
    if (planType.value == "both-goals") {
      planTypeArray.push("muscle-gain", "fat-lose");
    } else {
      planTypeArray.push([planType.value]);
    }
    customExercises.forEach((e) => {
      const thisDayExercises = [];
      if (e.style.display != "none") {
        const exerciseDay = e.getAttribute("id");
        planTypeArray.forEach((x) => {
          const allCheckedInps = e.querySelectorAll(
            "." + x + "-plan input:checked"
          );
          allCheckedInps.forEach((inp) => {
            thisDayExercises.push(inp.value);
          });
        });
        plan[exerciseDay] = thisDayExercises.join(" + ");
      }
    });
    customPlanSubmit.onclick = function () {
      res = new CustomPlans(customPlanName.value, plan);
      onAuthStateChanged(auth, (user) => {
        if (user) {
          const UID = user.uid;
          console.log(res);
          addPlanToDb(UID, res, customPlanName.value).catch((error) => {
            console.log(error);
            errormsg(error.message);
          });
        } else {
        }
      });
      return false;
    };
  }
}
export default createPlan;
