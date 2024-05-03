async function forgotPassword(e) {
  e.preventDefault();
  let myObj = {
    email: e.target.email.value.trim(),
  };
  try {
    const log = await axios.post(
      "/password/forgotPassword",
      myObj
    );
    // console.log(log);
    clear();
  } catch (err) {
    console.log(err);
    document.body.innerHTML += `<div style="color:red;">${err} <div>`;
  }
}

function clear() {
  document.getElementById("email").value = "";
}

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", () => {
  window.location.href = "/user/login";
});
