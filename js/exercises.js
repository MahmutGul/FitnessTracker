import usersProgress from "./usersProgress.js";

export const readyExercises = {
  legs: [
    "Squats or Leg press",
    "Weighted lunges",
    "Leg extention",
    "Leg curl",
    "Calf Press or Claf raises",
    "Butt kicks",
  ],
  biceps: ["Biceps curl", "Hammer curl", "Reverse Barbell Curl"],
  chest: [
    "Incline dumbbell press",
    "Bench press",
    "Dips",
    "Decline press",
    "Cable chest flys",
    "Low cable chest flys",
    "Pec deck flys",
    "Seated bench press",
  ],
  back: [
    "Pull-ups",
    "Lat PullDown",
    "Close-grip front lat pulldown",
    "Seated Cable Row",
    "Bent-Over",
    "Dumbbell shrugs",
    "Straight-arm pulldown",
    "Deadlift",
  ],
  triceps: ["Triceps pushdown", "Skull crusher", "Parallel bar dip or Diamond push up"],
  abs: [
    "Kneeling Cable Crunch",
    "Cable twist",
    "Crunch",
    "Russian twist",
    "Leg raises",
    "Hanging knee / leg raises",
  ],
  shoulders: [
    "Dumbbell Overhead Press",
    "Lateral raises",
    "Front raises",
    "Reverse Fly",
    "Upright rows",
    "Cable rotations (int and ext)",
  ],
  hiit: "HIIT",
  run: "Run",
  jumpRope: "Jump rope",
  cycle: "Cycle",
};

export function loadExercises(id) {
  const exercisesDiv = document.getElementById("exercises");
  var exercisesSTR = "";
  var i = 0;
  var saveButton = `<div style="text-align:center"><button>Save Button</button></div>`;
  if (Array.isArray(readyExercises[id])) {
    readyExercises[id].forEach((e) => {
      i++;
      exercisesSTR += `
                <div id="${id + "-" + i}" class="exercise">
                <h4>${i + "- " + e}</h4>
                <div class="custom-radio-chkbx small">
                <label>
                    <input type="checkbox" />
                    <span>Set 1</span>
                </label>
                <label>
                    <input type="checkbox" />
                    <span>Set 2</span>
                </label>
                <label>
                    <input type="checkbox" />
                    <span>Set 3</span>
                </label>
                <label>
                    <input type="checkbox" />
                    <span>Extra set</span>
                </label>
                </div>
            </div>
        `;
    });
  } else {
    var exname;
    id == "jump-rope" ? (exname = "jumpRope") : (exname = id);
    exercisesSTR += `
            <div style="text-align:center" class="exercise">
            <h4>${readyExercises[exname]}</h4>
            <div class="custom-radio-chkbx small">
            <label style="width:100%">
                <div style="margin-bottom: 4px">
                <span class="slider-value">1</span
                ><span class="slider-unit"> min</span>
                </div>
                <input
                type="range"
                max="60"
                min="0"
                req="40"
                step="1"
                value="0"
                />
            </label>
            </div>
        </div>
        `;
  }
  exercisesDiv.innerHTML += `
        <div class="popup bottom exercises" id="${id}-exercises">
        <div style="position: absolute; right: 2rem; top: 1rem; z-index: 9">
          <span class="popup-close">X</span>
        </div>
        <div
          class="container"
          style="text-align: left; overflow: scroll; overflow-x: hidden;padding-top: 4rem;"
        >
          <div class="exercise-group">
            ${exercisesSTR}
          </div>
        </div>
        <div class="saveButton" style="
        position: absolute;
        top: 0;
        border-bottom: 1px solid;
        left: 0;
        width: 100%;
        background: white;
        ">
          <button style="
          width: 7rem;
          padding: 0.5rem;
          margin: 1rem;
          float: left;
          ">Save All</button>
          <span style="
          position: absolute;
          left: 9rem;
          top: 50%;
          transform: translate(0, -50%);
          opacity: 0;
          transition: opacity 0.3s;
          font-weight: bolder;
          "></span>
        </div>
      </div>
        `;

  exerciseOnChange();
  function exerciseOnChange() {
    exercisesDiv.querySelectorAll("input").forEach((e) => {
      e.oninput = () => {
        exercisesDiv.querySelectorAll(".saveButton span").forEach((x) => {
          x.innerHTML = "✘ Not Saved";
          x.style.opacity = "1";
          x.style.color = "red";
        });
      };
    });
  }
}
