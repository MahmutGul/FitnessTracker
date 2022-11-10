function errormsg(errormsg) {
  const errorDiv = document.getElementById("error-msg");
  errorDiv.style.transition = "200ms";
  errorDiv.classList.add("show");
  errorDiv.innerHTML = "❌ " + errormsg;

  setTimeout(() => {
    errorDiv.style.transition = "1s";
    errorDiv.classList.remove("show");
  }, 3000);
}
export default errormsg;
