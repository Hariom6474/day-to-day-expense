async function login(e) {
  e.preventDefault();
  let email = e.target.email.value;
  let password = e.target.password.value;
  let myObj = {
    email: email.trim(),
    password: password,
  };
  try {
    // alert("Logged in Successfully.");
    const log = await axios.post("http://13.201.68.221:3000/user/login", myObj);
    clear();
    localStorage.setItem("token", log.data.token);
    // console.log(log, "post");
    window.location.href = "/user";
  } catch (err) {
    console.log(err);
    document.body.innerHTML += `<div style="color:red;">${err} <div>`;
  }
}

function clear() {
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
}

const signUpBtn = document.getElementById("signUpBtn");

signUpBtn.addEventListener("click", () => {
  window.location.href = "/user/signUp";
});

const forgot = document.getElementById("forgotPassword");

forgot.addEventListener("click", () => {
  window.location.href = "/password/forgotPassword";
});

