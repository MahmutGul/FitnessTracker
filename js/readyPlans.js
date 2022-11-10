function readyPlans(planName, selectedDays) {
  class ReadyPlans {
    constructor(name, days) {
      this[name] = {
        plan: {
          ...days,
        },
      };
    }
  }
  const days = {};
  const plans = {
    burnAndBuild: [
      "Chest + Biceps + HIIT",
      "Back + Triceps + Run",
      "Shoulders + Abs + Run",
      "Chest + Back + Run",
      "Legs + Run",
    ],
    buildMuscle: [
      "Back + Shoulders",
      "Chest + Biceps",
      "Back + Triceps",
      "Legs",
      "Chest + Abs",
    ],
    burnFat: ["HIIT", "Jump rop", "Run", "Cycle"],
  };
  var i = 0;
  for (let day of selectedDays) {
    days[day] = plans[planName][i];
    i++;
  }
  const burnAndbuild = new ReadyPlans(planName, days);

  return burnAndbuild;
}
export default readyPlans;
