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
