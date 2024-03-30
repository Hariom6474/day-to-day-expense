async function addExpense(e) {
  e.preventDefault();
  let Expenseamount = e.target.Expenseamount.value;
  let description = e.target.description.value;
  let category = e.target.category.value;
  let myObj = {
    Expenseamount: Expenseamount,
    description: description,
    category: category,
  };
  try {
    const token = localStorage.getItem("token");
    const add = await axios.post(
      "http://localhost:3000/user/add-expense",
      myObj,
      { headers: { Authorization: token } }
    );
    // console.log(add);
    myObj = add.data;
    // console.log(myObj);
    clearLeaderboardList();
    leaderboardDisplayed = false;
    createListItem(myObj);
  } catch (err) {
    console.log(err);
  }
}

function createListItem(myObj) {
  let ulist = document.querySelector(".list-group");
  let li = document.createElement("li");
  li.className = "list-group-item mt-3";
  let delbtn = document.createElement("input");
  delbtn.className = "btn btn-outline-danger btn-sm";
  delbtn.type = "button";
  delbtn.value = "Delete";
  let editbtn = document.createElement("input");
  editbtn.className = "btn btn-outline-secondary btn-sm";
  editbtn.type = "button";
  editbtn.value = "Edit";
  li.setAttribute("expense-item-id", myObj.id);
  li.appendChild(
    document.createTextNode(
      `${myObj.Expenseamount} - ${myObj.description} - ${myObj.category} `
    )
  );
  li.appendChild(delbtn);
  li.appendChild(editbtn);
  ulist.appendChild(li);
  delbtn.onclick = (e) => {
    let li = e.target.closest("li");
    const ExpenseId = myObj.id;
    if (li && ExpenseId) {
      deleteExpense(ExpenseId, li);
      clearLeaderboardList();
      leaderboardDisplayed = false;
    }
  };
  editbtn.onclick = (e) => {
    let li = e.target.closest("li");
    const ExpenseId = myObj.id;
    document.getElementById("Expenseamount").value = myObj.Expenseamount;
    document.getElementById("description").value = myObj.description;
    document.getElementById("category").value = myObj.category;
    deleteExpense(ExpenseId, li);
  };
  clearFormInput();
}

async function deleteExpense(ExpenseId, li) {
  try {
    const token = localStorage.getItem("token");
    const del = await axios.delete(
      `http://localhost:3000/user/delete-expense/${ExpenseId}`,
      {
        headers: { Authorization: token },
      }
    );
    if (del) {
      removeUserFromScreen(li);
    }
  } catch (err) {
    console.log(err);
  }
}

function removeUserFromScreen(li) {
  li.parentNode.removeChild(li);
}

function parseJwt(token) {
  var base64Url = token.split(".")[1];
  var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  var jsonPayload = decodeURIComponent(
    window
      .atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}

let leaderboardDisplayed = false;

function showLeaderboard() {
  const btnDiv = document.getElementById("btnLeaderboard");
  const btn = document.createElement("input");
  btn.type = "button";
  btn.value = "Leaderboard";
  btn.className = "btn btn-warning sm";
  btnDiv.appendChild(btn);
  btn.onclick = async () => {
    try {
      if (leaderboardDisplayed) {
        return;
      }
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:3000/premium/showLeaderboard",
        { headers: { Authorization: token } }
      );
      let leaderboardList = document.getElementById("leaderboardList");
      if (!leaderboardList.querySelector("h1")) {
        leaderboardList.innerHTML +=
          "<h1 style='color:#5d65fc;'>Leaderboard</h1>";
      }
      res.data.forEach((list) => {
        leaderboardList.innerHTML += `<li>Name - ${list.name} Total Expense - ${
          list.totalExpenses || 0
        } </li>`;
      });
      leaderboardDisplayed = true;
    } catch (err) {
      console.log(err);
    }
  };
}

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const token = localStorage.getItem("token");
    const parsedToken = parseJwt(token);
    const ispremiumuser = parsedToken.isPremiumUser;
    // console.log(ispremiumuser);
    if (ispremiumuser) {
      showPremium();
      showLeaderboard();
    }
    const res = await axios.get("http://localhost:3000/user/get-expense", {
      headers: { Authorization: token },
    });
    // console.log(res.data);
    res.data.forEach((item) => {
      createListItem(item);
    });
  } catch (err) {
    console.error(err);
  }
});

function clearFormInput() {
  document.getElementById("Expenseamount").value = "";
  document.getElementById("description").value = "";
  document.getElementById("category").value = "";
}

function clearLeaderboardList() {
  document.getElementById("leaderboardList").value = "";
}

document.getElementById("rzp-button1").onclick = async function (e) {
  const token = localStorage.getItem("token");
  const response = await axios.get(
    "http://localhost:3000/purchase/premium-membership",
    {
      headers: { Authorization: token },
    }
  );
  // console.log(response);
  var options = {
    key: response.data.key_id, // Enter the Key ID generated from the Dashboard
    order_id: response.data.order.id, // For one time payemnt
    // this handler function will handle the success payment
    handler: async function (response) {
      const update = await axios.post(
        "http://localhost:3000/purchase/updateTransactionStatus",
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        },
        {
          headers: { Authorization: token },
        }
      );
      if (update) {
        showPremium();
        localStorage.setItem("token", update.data.token);
      }
    },
  };
  var rzp1 = new Razorpay(options);
  rzp1.open();
  e.preventDefault();
  rzp1.on("payment.failed", function (response) {
    console.log(response);
    alert(response.error.code, "Something went wrong");
  });
};

function showPremium() {
  document.getElementById("rzp-button1").style.visibility = "hidden";
  document.getElementById("message").innerHTML = "Premium User";
}
