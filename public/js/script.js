async function getFormValue(e) {
  e.preventDefault();
  let name = e.target.name.value;
  let email = e.target.email.value;
  let password = e.target.password.value;
  let myObj = {
    name: name,
    email: email,
    password: password,
  };
  try {
    const add = await axios.post("http://localhost:3000/user/sign-up", myObj);
    // console.log(add);
    myObj = add.data;
    console.log(myObj);
  } catch (err) {
    console.log(err);
  }
}
