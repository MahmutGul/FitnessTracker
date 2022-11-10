import {
  loadingIcon,
  mainPageTodaySec,
  weekDays,
  todaysExercises,
} from "./ui.js";
import { auth, dbRef, db, bodyLoadIcon } from "./auth.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  set,
  get,
  child,
  push,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/9.4.0/firebase-database.js";
import trainingProgress from "./trainingProgress.js";
import reactions from "./reactions.js";
import { loadExercises } from "./exercises.js";
import usersProgress from "./usersProgress.js";

function mainPage() {
  const date = new Date();
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      bodyLoadIcon(true);
      const activePlan = await getActivePlanInfo().then((activePlan) => {
        bodyLoadIcon(false);
        mainPageLoad(activePlan.name, activePlan.plan);
      });
      reactions();
    }
  });
  async function getActivePlanInfo() {
    if (auth.currentUser != null) {
      const UID = auth.currentUser.uid;
      const res = {};
      var noError;
      for (let i = 0; i < 5; i++) {
        await get(child(dbRef, `usersplans/${UID}`))
          .then((snapshot) => {
            noError = true;
            const response = snapshot.val();
            if (snapshot.exists()) {
              for (let plans in response) {
                if (response[plans].active == true) {
                  res.name = plans;
                  res.plan = response[plans].plan;
                }
              }
            }
          })
          .catch((error) => {
            console.log(error);
          });
        if (noError == true) {
          break;
        }
      }
      return res;
    }
  }

  function mainPageLoad(planName, plan) {
    var currentPlan = `<div id="noPlans">
    <p>No existing plans.</p>
    <div class="br"></div>
    <a class="button" href="/create-a-plan.html">Create a plan</a>
  </div>`;
    if (plan) {
      if (typeof plan[weekDays[date.getDay()].toLowerCase()] !== "undefined") {
        currentPlan = "";
        // currentPlan = plan[weekDays[date.getDay()].toLowerCase()];
        const planArray = plan[weekDays[date.getDay()].toLowerCase()]
          .split("+")
          .map((s) => s.trim());
        let cardio = ["Run", "HIIT", "Cycle", "Jump-rope"];
        let existCardios = [];
        for (let exs of cardio) {
          if (planArray.includes(exs)) {
            existCardios.push(exs);
            todaysExercises.innerHTML += `
            <div class="exercise-progress ${exs.toLowerCase()}">
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom: 1rem;">
                  <p style="display:inline-block" class="exercise-name">${exs
                    .split("-")
                    .join(" ")}</p>
                  <button openpopup="${exs.toLowerCase()}-exercises" style="
                  height: fit-content;
                  font-size: 12px;
                  padding: 6px 10px;
                  ">Show</button>
                  </div>
                  <div class="progress">
                    <div class="progress-icon"></div>
                    <p>40min</p>
                  </div>
                  <div class="progress-bar">
                    <div>
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                </div>
            `;
            loadExercises(exs.toLowerCase());
          }
        }
        planArray.forEach((e) => {
          if (!existCardios.includes(e)) {
            loadExercises(e.toLowerCase());
            const exerciseCount = document.querySelectorAll(
              `#${e.toLowerCase()}-exercises .exercise`
            ).length;
            todaysExercises.innerHTML += `
            <div class="exercise-progress ${e.toLowerCase()}">
                  <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom: 0.5rem;">
                  <p class="exercise-name">${e}</p>
                  <button openpopup="${e.toLowerCase()}-exercises" style="
                  height: fit-content;
                  font-size: 12px;
                  padding: 6px 10px;
                  ">Show</button>
                  </div>
                  <div class="progress">
                    <div class="progress-icon"></div>
                    <p>${exerciseCount} exercises</p>
                  </div>
                  <div class="progress-bar">
                    <div>
                      <div></div>
                      <div></div>
                    </div>
                  </div>
                </div>
            `;
          }
        });
      } else {
        currentPlan = "REST DAY!";
      }
      usersProgress();
    }

    mainPageTodaySec.innerHTML = `<h2>${
      weekDays[date.getDay()]
    }:</h2><span>${currentPlan}</span>`;
  }
}
export default mainPage;
