export const userName = document.querySelector('#username');
export const userEmail = document.querySelector('#useremail');
export const userPass = document.querySelector('#userpass');
export const userCPass = document.querySelector('#usercpass');
export const userLastName = document.querySelector('#lastname');
export const userFirstName = document.querySelector('#firstname');
export const signupForm = document.querySelector('#register_form');
export const loginForm = document.querySelector('#login_form');
export const errorMessage = document.querySelector('#error-message');
export const logoutNav = document.querySelectorAll('.logoutnav');
export const loginNav = document.querySelector('#loginnav');
export const registerNav = document.querySelector('#registernav');
export const rememberInput = document.querySelector('#rememberInput');
export const savedUserEmail = sessionStorage.getItem('useremail') || localStorage.getItem('useremail');
export const savedUserPass = sessionStorage.getItem('userpass') || localStorage.getItem('userpass');
export const sendVerificationAgain = document.getElementById('sendverificationagain');
export const editProfileFrom = document.getElementById('edit_profile');
export const usernameNav = document.getElementById('username-nav');
export const userInfoNav = document.querySelector('.user-info-container');
export const userInfoNavMenu = document.querySelector('.user-info-container > ul > ul');
export const usernameState = document.querySelector('#username_state');
export const profilePicture = document.querySelector('#profile-picture');
export const profilePictureNav = document.querySelector('#profile-picture-nav');
export const profilePictureEdit = document.querySelector('#profile-picture-edit');
export const uploadProfilePicture = document.querySelector('#upload-profile-picture');
export const loadingIcon = document.querySelector('#loading-icon');
export const userFullnameProfile = document.querySelector('#user-fullname');
export const profileUsername = document.querySelector('#profile-username');
export const Today = document.querySelector('#today');
export const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const mainPageTodaySec = document.getElementById('today');
export const planInfInputs = document.querySelectorAll("#plan-inf input");
export const planType = document.querySelector("#plan-type input:checked");
export const muscleGain = document.querySelectorAll(".muscle-gain-plan");
export const fatLose = document.querySelectorAll(".fat-lose-plan");
export const customExercises = document.querySelectorAll(".exercise-day");
export const customPlanSwitch = document.getElementById('customplaninput');
export const customPlanForm = document.getElementById('custom-plan');
export const planLoad = document.getElementById('plan-load');
export const readyMadePlans = document.getElementById('ready-made-plan');
export const readyPlan = document.querySelectorAll(".ready-plan");
export const customPlanName = document.querySelector("#custom-plan-name");
export const customPlanSubmit = document.querySelector("#custom-plan-submit");
export const allUserPlan = document.querySelector("#userplans");
export const todaysExercises = document.querySelector("#todaysExercises");
export const startTrainingBtn = document.querySelector("#start-training");
export const addRecordBtn = document.querySelector("#add-record-btn");
export const addRecord = document.querySelector("#add-record");
export const navm = document.querySelector("#navm");