async function getFormValue(e) {
  e.preventDefault();
  let name = e.target.name.value;
  let email = e.target.email.value;
  let password = e.target.password.value;
  let myObj = {
    name: name.trim(),
    email: email.trim(),
    password: password,
  };
  try {
    const add = await axios.post("http://13.201.68.221:3000/user/sign-up", myObj);
    clear();
    // console.log(add, "post");
    window.location.href = "/user/login";
  } catch (err) {
    console.log(err);
    document.body.innerHTML += `<div style="color:red;">${err} <div>`;
  }
}

function clear() {
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
}

const loginBtn = document.getElementById("loginbtn");

loginBtn.addEventListener("click", () => {
  window.location.href = "/user/login";
});
