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
    const log = await axios.post("http://localhost:3000/user/login", myObj);
    clear();
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
