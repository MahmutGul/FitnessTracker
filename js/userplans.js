import { auth, dbRef, db, bodyLoadIcon } from "./auth.js";
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
import { allUserPlan } from "./ui.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-auth.js";

function userPlans() {
  bodyLoadIcon(true);
  onAuthStateChanged(auth, (user) => {
    if (user) {
      getUserPlans().then(() => {
        bodyLoadIcon(false);
        activatePlan();
        editPlan();
      });
    }
  });
  async function getUserPlans() {
    if (auth.currentUser != null) {
      const UID = auth.currentUser.uid;
      for (let i = 0; i < 4; i++) {
        var noError = true;
        await get(child(dbRef, `usersplans/${UID}`))
          .then((snapshot) => {
            const response = snapshot.val();
            if (response == null) {
              allUserPlan.innerHTML += `<div id="noPlans">
              <p>No existing plans.</p>
              <div class="br"></div>
              <a class="button" href="/create-a-plan.html">Create a plan</a>
            </div>`;
            }
            if (snapshot.exists()) {
              for (let data in response) {
                const planName = data;
                const planDays = Object.keys(response[data].plan);
                const planState = response[data].active
                  ? `<span planName="${planName}" class="button plan-state active">✓ Active</span>`
                  : `<span planName="${planName}" class="button plan-state">Activate</span>`;
                var planDetails = "";
                var sortedPlanDays = "";
                let days = [
                  "sunday",
                  "monday",
                  "tuesday",
                  "wednesday",
                  "thursday",
                  "friday",
                  "saturday",
                ];
                for (let day of days) {
                  const dayCap = day[0].toUpperCase() + day.slice(1);
                  var planDayDisplay = "style='display:none'";
                  planDays.forEach((e) => {
                    if (e == day) {
                      planDayDisplay = "class='planDay'";
                      const eCap = e[0].toUpperCase() + e.slice(1);
                      planDetails +=
                        "<span style='color:green;'>" +
                        eCap +
                        ": </span>" +
                        response[data].plan[e] +
                        "<br>";
                    }
                  });
                  sortedPlanDays += `<span name='${day}' ${planDayDisplay}>${dayCap.slice(
                    0,
                    2
                  )}</span>`;
                }
                allUserPlan.innerHTML += `
              <div class="plan-container">
                <div class="plan-summ">
                  <h3 class="plan-name">${data}</h3>
                  <input type='text' class="plan-name" value='${data}'>
                  <div class="plan-days">${sortedPlanDays}</div>
                  <div class="plan-control">
                    <span class="plan-remove button">Remove</span>
                    <span class="plan-edit button">Edit</span>
                    ${planState}
                  </div>
                </div>
                <div class="plan-details">
                    <div>${planDetails}</div>
                </div>
              </div>`;
              }
            }
          })
          .catch((error) => {
            console.error(error);
            noError = false;
            if (error && i == 3) {
              location.reload();
            }
          });
        if (noError) {
          break;
        }
      }
    }
  }
  function activatePlan() {
    if (auth.currentUser != null) {
      const UID = auth.currentUser.uid;
      const activateButton = document.querySelectorAll(".button.plan-state");
      activateButton.forEach((e) => {
        const planName = e.getAttribute("planName");
        e.addEventListener("click", async () => {
          bodyLoadIcon(true);
          await get(child(dbRef, `usersplans/${UID}`)).then((snapshot) => {
            const response = snapshot.val();
            if (snapshot.exists()) {
              for (let data in response) {
                remove(ref(db, `usersplans/${UID}/${data}/active`));
              }
            }
          });
          set(ref(db, `usersplans/${UID}/${planName}/active`), true).then(
            () => {
              activateButton.forEach((x) => {
                x.classList.remove("active");
                x.innerHTML = "Activate";
              });
              e.classList.add("active");
              e.innerHTML = "✓ Active";
              bodyLoadIcon(false);
            }
          );
        });
      });
    }
  }
  function editPlan() {
    const planCont = document.querySelectorAll(".plan-container");
    planCont.forEach((pcont) => {
      const planDaysCount = pcont.querySelectorAll(
        ".plan-days .planDay"
      ).length;
      const planEditBtn = pcont.querySelector(".plan-edit");
      const planRemoveBtn = pcont.querySelector(".plan-remove");
      const planName = pcont.querySelector("h3.plan-name").innerHTML;
      var planNewName = planName;
      planEditBtn.onclick = () => {
        if (planEditBtn.innerHTML == "Edit") {
          planEditBtn.innerHTML = "Save";
          pcont.classList.add("editing");
          pcont.querySelectorAll(".editing .plan-days > span").forEach((e) => {
            e.onclick = () => {
              e.classList.toggle("planDay");
              checkDaysCount(
                e.parentElement.parentElement,
                planDaysCount,
                planEditBtn
              );
            };
          });
        } else {
          planEditBtn.innerHTML = "Edit";
          pcont.classList.remove("editing");
          const planDays = [];
          pcont
            .querySelectorAll(".plan-days .planDay")
            .forEach((planDayName) => {
              planDays.push(planDayName.getAttribute("name"));
            });
          updatePlan(planName, planNewName, planDays);
        }
        const planNameInput = pcont.querySelector("input.plan-name");
        planNameInput.onchange = () => {
          planNewName = planNameInput.value;
        };
      };
      planRemoveBtn.onclick = () => {
        removePlan(planName);
      };
    });
    function checkDaysCount(parent, planDaysCount, planEditBtn) {
      const selectedDays = parent.querySelectorAll(".editing span.planDay");
      if (planDaysCount != selectedDays.length) {
        planEditBtn.classList.add("disabled");
      } else {
        planEditBtn.classList.remove("disabled");
      }
    }
    async function updatePlan(planName, planNewName, planDays) {
      bodyLoadIcon(true);
      let days = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ];
      if (auth.currentUser != null) {
        const UID = auth.currentUser.uid;
        const allExercises = [];
        const resPlan = {};
        await get(child(dbRef, `usersplans/${UID}/${planName}/plan`))
          .then((snapshot) => {
            const response = snapshot.val();
            if (snapshot.exists()) {
              for (let data of days) {
                response[data] ? allExercises.push(response[data]) : "";
              }
              for (let i = 0; i < 8; i++) {
                if (planDays[i] && allExercises[i]) {
                  resPlan[planDays[i]] = allExercises[i];
                }
              }
              set(ref(db, `usersplans/${UID}/${planName}/plan`), resPlan).then(
                async () => {
                  document.querySelectorAll(".plan-container").forEach((e) => {
                    e.remove();
                  });
                  await get(child(dbRef, `usersplans/${UID}/${planName}`)).then(
                    (snapshot) => {
                      const response = snapshot.val();
                      if (snapshot.exists()) {
                        const allData = response;
                        remove(ref(db, `usersplans/${UID}/${planName}`));
                        set(
                          ref(db, `usersplans/${UID}/${planNewName}`),
                          allData
                        );
                      }
                    }
                  );
                  getUserPlans().then(() => {
                    bodyLoadIcon(false);
                    activatePlan();
                    editPlan();
                  });
                }
              );
            }
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
    async function removePlan(planName) {
      bodyLoadIcon(true);
      if (auth.currentUser != null) {
        const UID = auth.currentUser.uid;
        remove(ref(db, `usersplans/${UID}/${planName}`)).then(() => {
          document.querySelectorAll(".plan-container").forEach((e) => {
            e.remove();
          });
          getUserPlans().then(() => {
            bodyLoadIcon(false);
            activatePlan();
            editPlan();
          });
        });
      }
    }
  }
}

export default userPlans;
