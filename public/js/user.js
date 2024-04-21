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

let hasAddedHeading = false;

function createListItem(myObj) {
  const tableBody = document.querySelector("tbody");
  const tableRow = document.createElement("tr");
  tableRow.classList.add("border", "border-dark", "border-2");
  const extractedDate = extractDate(myObj.updatedAt);
  const dateCell = document.createElement("td");
  dateCell.textContent = extractedDate;
  dateCell.classList.add("expense-date");
  dateCell.classList.add("border", "border-dark", "border-2");

  if (!hasAddedHeading) {
    const tableHead = document.createElement("thead");
    const headingRow = document.createElement("tr");
    const headingDate = document.createElement("th");
    headingDate.textContent = "Date";
    headingDate.classList.add(
      "expense-date",
      "border",
      "border-dark",
      "border-2"
    );
    const headingAmount = document.createElement("th");
    headingAmount.textContent = "Amount";
    headingAmount.classList.add("border", "border-dark", "border-2");
    const headingDescription = document.createElement("th");
    headingDescription.textContent = "Description";
    headingDescription.classList.add("border", "border-dark", "border-2");
    const headingCategory = document.createElement("th");
    headingCategory.textContent = "Category";
    headingCategory.classList.add("border", "border-dark", "border-2");
    const headingActions = document.createElement("th");
    headingActions.textContent = "Actions";
    headingActions.classList.add("border", "border-dark", "border-2");
    headingDate.style.borderRight = "none";
    headingAmount.style.borderRight = "2px solid black";
    headingDescription.style.borderRight = "2px solid black";
    headingCategory.style.borderRight = "2px solid black";
    headingRow.appendChild(headingDate);
    headingRow.appendChild(headingAmount);
    headingRow.appendChild(headingDescription);
    headingRow.appendChild(headingCategory);
    headingRow.appendChild(headingActions);
    tableHead.appendChild(headingRow);
    const table = tableBody.parentElement;
    table.insertBefore(tableHead, tableBody);
    hasAddedHeading = true;
  }

  const amountCell = document.createElement("td");
  amountCell.style.borderRight = "2px solid black";
  amountCell.textContent = myObj.Expenseamount;
  const descriptionCell = document.createElement("td");
  descriptionCell.style.borderRight = "2px solid black";
  descriptionCell.textContent = myObj.description;
  const categoryCell = document.createElement("td");
  categoryCell.style.borderRight = "2px solid black";
  categoryCell.textContent = myObj.category;
  const actionsCell = document.createElement("td");
  const delbtn = document.createElement("button");
  delbtn.className = "btn btn-outline-danger btn-sm";
  delbtn.textContent = "Delete";
  const editbtn = document.createElement("button");
  editbtn.className = "btn btn-outline-secondary btn-sm";
  editbtn.textContent = "Edit";
  actionsCell.appendChild(delbtn);
  actionsCell.appendChild(editbtn);
  tableRow.setAttribute("expense-item-id", myObj.id);
  tableRow.insertBefore(dateCell, tableRow.firstChild);
  tableRow.appendChild(amountCell);
  tableRow.appendChild(descriptionCell);
  tableRow.appendChild(categoryCell);
  tableRow.appendChild(actionsCell);
  tableBody.appendChild(tableRow);
  delbtn.onclick = (e) => {
    const tableRow = e.target.closest("tr");
    const ExpenseId = myObj.id;
    if (tableRow && ExpenseId) {
      deleteExpense(ExpenseId, tableRow);
      clearLeaderboardList();
      leaderboardDisplayed = false;
    }
  };
  editbtn.onclick = (e) => {
    const tableRow = e.target.closest("tr");
    const ExpenseId = myObj.id;
    document.getElementById("Expenseamount").value = myObj.Expenseamount;
    document.getElementById("description").value = myObj.description;
    document.getElementById("category").value = myObj.category;
    deleteExpense(ExpenseId, tableRow);
  };
  clearFormInput();
}

function extractDate(updatedAt) {
  const date = new Date(updatedAt);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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

async function showDownloadButton() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:3000/user/download", {
      headers: { Authorization: token },
    });
    if (response.status === 200) {
      let downloadexpense = document.createElement("a");
      downloadexpense.href = response.data.fileURL;
      downloadexpense.download = "myexpense.csv";
      downloadexpense.click();
    } else {
      throw new Error(response.data.message);
    }
    const downloaded = await axios.get(
      "http://localhost:3000/user/downloaded-expense",
      {
        headers: { Authorization: token },
      }
    );
    let downloadedListHTML = "<h1>Downloaded Expenses</h1>";
    downloaded.data.downloadedExpenseData.forEach((item) => {
      const datePart = item.updatedAt.slice(0, 10);
      downloadedListHTML += `<li>${datePart} -> <a href="${item.fileURL}" download>Download File</a></li>`;
    });
    let downloadedList = document.getElementById("downloadedexpense");
    downloadedList.innerHTML = downloadedListHTML;
  } catch (err) {
    console.error(err);
  }
}

const page = 1;
const rowPerPage = document.getElementById("rowPerPage");
const rowBtn = document.getElementById("rowbtn");
rowBtn.addEventListener("click", () => {
  localStorage.setItem("rowPerPage", rowPerPage.value);
  removeAllExpense();
  getProducts(page);
});

window.addEventListener("DOMContentLoaded", async () => {
  try {
    const token = localStorage.getItem("token");
    const parsedToken = parseJwt(token);
    const ispremiumuser = parsedToken.isPremiumUser;
    const row = localStorage.getItem("rowPerPage") || rowPerPage.value;
    // console.log(ispremiumuser);
    if (ispremiumuser) {
      showPremium();
      showLeaderboard();
      // showDownloadButton();
      document.getElementById("downloadexpense").style.visibility = "visible";
    }
    const res = await axios.get(
      `http://localhost:3000/user/get-expense?page=${page}&rowPerPage=${row}`,
      {
        headers: { Authorization: token },
      }
    );
    // console.log(res.data.data[1]);
    for (let i = 0; i < res.data.data.length; i++) {
      createListItem(res.data.data[i]);
    }
    showPagination(res.data); // has to be outside the loop to prevent multiple get req
  } catch (err) {
    console.error(err);
  }
});

function showPagination({
  currentPage,
  hasNextPage,
  nextPage,
  hasPrevPage,
  prevPage,
  lastPage,
}) {
  const prevBtn = document.getElementById("btn1");
  const nextBtn = document.getElementById("btn2");
  prevBtn.style.visibility = "hidden";
  nextBtn.style.visibility = "hidden";
  if (hasPrevPage) {
    prevBtn.style.visibility = "visible";
    btn1.addEventListener("click", () => {
      getProducts(prevPage);
    });
  }
  const pagination = document.getElementById("pagination");
  const a = document.createElement("a");
  a.className = "page-item";
  pagination.innerHTML = `<h3>${currentPage}</h3>`;
  a.addEventListener("click", () => {
    getProducts(currentPage);
  });
  pagination.appendChild(a);
  if (hasNextPage) {
    nextBtn.style.visibility = "visible";
    btn2.addEventListener("click", () => {
      getProducts(nextPage);
    });
  }
}

async function getProducts(page) {
  const token = localStorage.getItem("token");
  const row = localStorage.getItem("rowPerPage") || rowPerPage.value;
  const res = await axios.get(
    `http://localhost:3000/user/get-expense?page=${page}&rowPerPage=${row}`,
    {
      headers: { Authorization: token },
    }
  );
  removeAllExpense();
  for (let i = 0; i < res.data.data.length; i++) {
    createListItem(res.data.data[i]);
  }
  showPagination(res.data);
}

function removeAllExpense() {
  const expenseBody = document.getElementById("expenseBody");
  while (expenseBody.hasChildNodes()) {
    expenseBody.removeChild(expenseBody.firstChild);
  }
}

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
