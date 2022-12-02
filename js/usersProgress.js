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
import { loadingIcon } from "./ui.js";

function usersProgress() {
  const exercisesDiv = document.getElementById("exercises");
  const date = new Date();
  const yDate = new Date();
  yDate.setDate(date.getDate() - 1);

  const fullDate =
    date.getDate() +
    "_" +
    (Number(date.getMonth()) + 1) +
    "_" +
    date.getFullYear();
  const yFullDate =
    yDate.getDate() +
    "_" +
    (Number(yDate.getMonth()) + 1) +
    "_" +
    date.getFullYear();

  onAuthStateChanged(auth, async (user) => {
    if (user) {
      onSave();
      await loadCurrentProgress();
    }
  });

  async function loadCurrentProgress() {
    const currentProgress = await getProgress(fullDate).then((res) => {
      for (let daysExercise in res[fullDate]) {
        for (let exerciseId in res[fullDate][daysExercise]) {
          if (res[fullDate][daysExercise][exerciseId] != 0) {
            for (
              let checkedSets = 0;
              checkedSets < res[fullDate][daysExercise][exerciseId];
              checkedSets++
            ) {
              if (document.getElementById(exerciseId) != null) {
                document.getElementById(exerciseId).querySelectorAll("input")[
                  checkedSets
                ].checked = true;
              }
            }
            if (exerciseId == "duration") {
              var rotRes2 =
                (res[fullDate][daysExercise][exerciseId] / 40) * 180;
              rotRes2 > 180 ? (rotRes2 = 180) : "";
              document.querySelector(
                `.${daysExercise}.exercise-progress .progress-bar > div`
              ).style.transform = `rotate(${rotRes2}deg)`;
              document
                .getElementById(`${daysExercise}-exercises`)
                .querySelector("input").value =
                res[fullDate][daysExercise][exerciseId];
              var mEvent = new Event("input");
              document
                .getElementById(`${daysExercise}-exercises`)
                .querySelector("input")
                .dispatchEvent(mEvent);
            }
          }
          if (
            exerciseId != "duration" &&
            document.querySelector(`#${daysExercise}-exercises`)
          ) {
            const doneSets = document
              .querySelector(`#${daysExercise}-exercises`)
              .querySelectorAll("input:checked").length;
            const reqSets =
              (document
                .querySelector(`#${daysExercise}-exercises`)
                .querySelectorAll("input").length /
                4) *
              3;
            var rotRes = (doneSets / reqSets) * 180;
            rotRes > 180 ? (rotRes = 180) : "";
            document.querySelector(
              `.${daysExercise}.exercise-progress .progress-bar > div`
            ).style.transform = `rotate(${rotRes}deg)`;
          }
        }
      }
    });
    LoadrecentActivity();
    function LoadrecentActivity() {
      const recentSummaryDiv = document.querySelector("#recent-summary");
      const yesterdaySummaryDiv = document.querySelector("#yesterday-summary");

      getProgress(yFullDate).then((res) => {
        yesterdaySummaryDiv.innerHTML = "";
        const exercises = res[yFullDate];
        var setsDone = 0;
        var exercisesDone = 0;
        const exercisesObj = {};
        const exercisesObjChart = {};
        for (let exercise in exercises) {
          var exerciseprogress = 0;
          if (exercise != "totalScore") {
            const exercisesCount = Object.keys(exercises[exercise]).length;
            const reqSetsCount = exercisesCount * 3;
            for (let sets in exercises[exercise]) {
              if (exercises[exercise][sets] > 0) {
                if (sets == "duration") {
                  exerciseprogress = exercises[exercise][sets];
                  exercisesObj[exercise] = `<b>${exerciseprogress} Minutes</b>`;
                  if (exercises[exercise][sets] >= 20) {
                    setsDone++;
                  }
                  if (exercises[exercise][sets] >= 30) {
                    setsDone++;
                  }
                  if (exercises[exercise][sets] >= 40) {
                    setsDone++;
                  }
                  if (exercises[exercise][sets] >= 50) {
                    setsDone++;
                  }
                  exerciseprogress = setsDone;
                } else {
                  exerciseprogress += exercises[exercise][sets];
                  setsDone += exercises[exercise][sets];
                }
                exercisesDone++;
              }
            }
            if (!exercisesObj[exercise]) {
              exercisesObj[exercise] = `<b>${exerciseprogress} Sets</b>`;
            }
            exercisesObjChart[`${exercise}`] = exerciseprogress;
          }
        }
        var x = "";
        for (let e in exercisesObj) {
          x += `<p>
          ${e[0].toUpperCase() + e.slice(1)}: ${exercisesObj[e]}.
          </p>
          `;
        }
        if (setsDone != 0) {
          yesterdaySummaryDiv.innerHTML += `
            <p>
              Yesterday you earned <b>${setsDone}</b> point.
            </p>
            <p>
              Plan: <b>${Object.keys(exercisesObj).map(
                (a) => a[0].toUpperCase() + a.slice(1)
              )}</b>
            </p>
            <h3>Your progress:</h3>
            <p>
              ${x}
            </p>
            `;
        } else {
          yesterdaySummaryDiv.innerHTML += `
            <p>
              Yesterday you earned <b>${setsDone}</b> point.
            </p>
            `;
        }
        google.charts.load("current", { packages: ["corechart"] });
        google.charts.setOnLoadCallback(drawVisualization);
        function drawVisualization() {
          const allDays = res;
          delete allDays.totalScore;
          var allDays2 = Object.keys(res);
          allDays2 = allDays2.map((a) => {
            var x = a.split("_").reverse();
            if (x[2].length < 2) {
              let z = x[2];
              x.pop();
              x.push("0" + z);
            }
            return x.join("_");
          });
          allDays2.sort(function (a, b) {
            var x = a.replace(/_/g, "");
            var y = b.replace(/_/g, "");
            return y - x;
          });
          let cData = [];
          for (let day in allDays) {
            const dayDate = day.split("_");
            if (dayDate[0].length < 2) {
              let z = dayDate[0];
              dayDate.shift();
              dayDate.unshift("0" + z);
            }
            cData.push([
              dayDate.join("/"),
              allDays[day].totalScore,
              allDays[day].totalScore,
            ]);
          }
          cData.sort(function (a, b) {
            let x = a[0].split("/").reverse();
            if (x[2].length < 2) {
              let z = x[2];
              x.pop();
              x.push(z);
            }
            let y = b[0].split("/").reverse();
            if (b[2].length < 2) {
              let z = b[2];
              b.pop();
              b.push(z);
            }

            return (
              allDays2.indexOf(y.join("_")) - allDays2.indexOf(x.join("_"))
            );
          });
          if (cData.length > 6) {
            cData = cData.slice(-7);
          }
          if (cData.length > 1) {
            var data = google.visualization.arrayToDataTable([
              ["", "Points", "Average"],
              ...cData,
            ]);

            var options = {
              title: "Your Recent Poins Graphic",
              // vAxis: { title: "Points" },
              // hAxis: { title: "Exercises" },
              seriesType: "bars",
              series: { 1: { type: "line" } },
              legend: "none",
            };
            var chart = new google.visualization.ComboChart(
              document.getElementById("recentPointsChart")
            );
            chart.draw(data, options);
          }
        }
        window.onresize = doALoadOfStuff;

        function doALoadOfStuff() {
          drawVisualization();
        }
      });
    }
  }
  async function getProgress(fullDate) {
    if (auth.currentUser != null) {
      const UID = auth.currentUser.uid;
      var res = {};
      res[fullDate] = {};
      var noError;
      for (let i = 0; i < 5; i++) {
        await get(child(dbRef, `usersprogress/${UID}`))
          .then((snapshot) => {
            noError = true;
            const response = snapshot.val();
            if (snapshot.exists()) {
              res.totalScore = response.totalScore;
              res = response;
              if (response[fullDate]) {
                res[fullDate] = response[fullDate];
                return res;
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
  function updateProgress(path, res) {
    if (auth.currentUser != null) {
      const UID = auth.currentUser.uid;
      loadingIcon.style.display = "";
      update(ref(db, `usersprogress/${UID}/${path}`), res).then(() => {
        loadingIcon.style.display = "none";
      });
    }
  }
  async function setProgress(path, res) {
    if (auth.currentUser != null) {
      const UID = auth.currentUser.uid;
      loadingIcon.style.display = "";
      await set(ref(db, `usersprogress/${UID}/${path}`), res).then(() => {
        loadingIcon.style.display = "none";
      });
    }
  }
  function onSave() {
    const res = {};
    res[fullDate] = {};
    exercisesDiv.querySelectorAll(".saveButton button").forEach((e) => {
      e.onclick = () => {
        const allExercises = exercisesDiv.querySelectorAll(".exercises");
        var allDayCheckedSets = exercisesDiv.querySelectorAll(
          ".exercise input:checked"
        ).length;
        allExercises.forEach(async (x) => {
          const exerciseName = x.getAttribute("id").replace("-exercises", "");
          const exerciseElement = x.querySelectorAll(".exercise");

          res[fullDate][exerciseName] = {};
          exerciseElement.forEach((s) => {
            var exerciseId = s.getAttribute("id");
            if (!s.getAttribute("id")) {
              exerciseId = "duration";
            }
            const setsDone = s.querySelectorAll("input:checked").length;
            const cardioDuration = s.querySelector("input[type='range']");
            res[fullDate][exerciseName][exerciseId] = setsDone;
            if (cardioDuration) {
              res[fullDate][exerciseName][exerciseId] = cardioDuration.value;
              if (cardioDuration.value >= 20) {
                allDayCheckedSets++;
              }
              if (cardioDuration.value >= 30) {
                allDayCheckedSets++;
              }
              if (cardioDuration.value >= 40) {
                allDayCheckedSets++;
              }
              if (cardioDuration.value >= 50) {
                allDayCheckedSets++;
              }
            }
            res[fullDate].totalScore = allDayCheckedSets;
          });

          const currentProgress = await getProgress(fullDate).then((r) => {
            var oldTotalScore = 0;
            var oldTodayScroe = 0;
            if (r.totalScore) {
              oldTotalScore = r.totalScore;
            }
            if (r[fullDate]) {
              oldTodayScroe = r[fullDate].totalScore;
            }
            const addedtototal = Number(oldTodayScroe);
            const allTotalScore =
              Number(oldTotalScore) +
              (Number(res[fullDate].totalScore) - Number(addedtototal));
            setProgress(`totalScore`, allTotalScore).then(() => {
              document.getElementById("totalScore").innerHTML = allTotalScore;
              loadCurrentProgress();
            });
            updateProgress(
              `${fullDate}/${exerciseName}`,
              res[fullDate][exerciseName]
            );
            setProgress(`${fullDate}/totalScore`, res[fullDate].totalScore);
          });
        });

        exercisesDiv.querySelectorAll(".saveButton span").forEach((x) => {
          x.innerHTML = "✅ Saved";
          x.style.opacity = "1";
          x.style.color = "green";
          setTimeout(() => {
            x.innerHTML == "✅ Saved" ? (x.style.opacity = "0") : "";
          }, 2500);
        });
      };
    });
  }
}
export default usersProgress;
