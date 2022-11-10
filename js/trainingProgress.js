import { startTrainingBtn, addRecordBtn, addRecord } from "./ui.js";

function trainingProgress() {
  function startTraining() {
    sessionStorage.setItem("Training-Started", true);
    alert(sessionStorage.getItem("Training-Started"));
  }
  function stopTraining() {
    sessionStorage.setItem("Training-Started", false);
    alert(sessionStorage.getItem("Training-Started"));
  }
  function addRecordF() {}
  startTrainingBtn.onclick = startTraining;
  addRecordBtn.onclick = addRecordF;
}
export default trainingProgress;
