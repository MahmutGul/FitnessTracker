import User_data from "./user-data.js";
import Users from "./users.js";
import reactions from "./reactions.js";
import {
  planInfInputs
} from "./ui.js";
import createPlan from "./createPlan.js";
import mainPage from "./mainPage.js";
import userPlans from "./userplans.js";

(function () {
  Users();
  User_data();
  location.pathname == "/index.html" ? location.pathname = "/":"";
  location.pathname == "/prograss.html" ? mainPage():"";
  location.pathname == "/my-plans.html" ? userPlans():"";
  location.pathname == "/create-a-plan.html" ? createPlan():"";
  reactions();
  // alert(date.getFullYear());
  // alert(date.getMonth());
  // alert(date.getDate());
})();
