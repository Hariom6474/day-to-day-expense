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

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:3000/user/get-expense", {
      headers: { Authorization: token },
    });
    // console.log(res.data);
    for (let i = 0; i < res.data.length; i++) {
      createListItem(res.data[i]);
    }
  } catch (err) {
    console.error(err);
  }
});

function clearFormInput() {
  document.getElementById("Expenseamount").value = "";
  document.getElementById("description").value = "";
  document.getElementById("category").value = "";
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
        document.getElementById("rzp-button1").style.visibility = "hidden";
        document.getElementById("message").innerHTML = "Premium User";
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
