async function forgotPassword() {
  e.preventDefault();
}

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", () => {
  window.location.href = "/user/login";
});
