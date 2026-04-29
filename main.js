// ================= CEK HALAMAN =================
const isDashboard = window.location.pathname.includes("dashboard.html");

// ================= LOGIN =================
function login() {
  const user = document.getElementById("username").value;
  const pass = document.getElementById("password").value;

  if (user === "admin" && pass === "123") {
    localStorage.setItem("login", "true");
    localStorage.setItem("user", user);
    window.location.href = "dashboard.html";
  } else {
    alert("Username / Password salah!");
  }
}

// ================= CEK LOGIN =================
if (isDashboard) {
  if (!localStorage.getItem("login")) {
    window.location.href = "index.html";
  }
}

// ================= USER NAME =================
const userName = document.getElementById("userName");
if (userName) {
  userName.innerText = "👋 Hi, " + (localStorage.getItem("user") || "User");
}

// ================= DATA =================
const content = document.querySelector(".content");

// AMBIL DATA LAMA (fallback dari todos)
let kelarIn = JSON.parse(localStorage.getItem("kelarIn")) 
           || JSON.parse(localStorage.getItem("todos")) 
           || [];

let history = JSON.parse(localStorage.getItem("todoHistory")) || [];
let undoStack = JSON.parse(localStorage.getItem("undoStack")) || [];

function save() {
  localStorage.setItem("kelarIn", JSON.stringify(kelarIn));
  localStorage.setItem("todoHistory", JSON.stringify(history));
  localStorage.setItem("undoStack", JSON.stringify(undoStack));
}

// ================= HOME =================
function showHome() {
  const title = document.getElementById("pageTitle");
  if (title) title.innerText = "Home";
  if (!content) return;

  const lastTask = kelarIn.length > 0 ? kelarIn[kelarIn.length - 1] : null;

  content.innerHTML = `
    <div class="card big" style="text-align: center; padding: 40px 20px;">
      <img src="img/logo.png" style="width: 80px; margin-bottom: 20px;">
      <h2>Selamat Datang Kembali! ✨</h2>

      ${
        lastTask
          ? `<h3>${lastTask.text}</h3>`
          : `<div class="empty">Belum ada tugas</div>`
      }
    </div>
  `;
}

// ================= TASK =================
function showTasks() {
  const title = document.getElementById("pageTitle");
  if (title) title.innerText = "Daftar Kelar-In";
  if (!content) return;

  let html = `
  <div class="card">
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <h3>Tumpukan Kelar-In (LIFO)</h3>

      <div style="display:flex; gap:10px;">
        <button onclick="undoRemove()" class="icon-btn-main">
          <img src="icon/undo.png" class="btn-icon"> Undo
        </button>

        <button onclick="removeTodo()" class="icon-btn-main delete">
          <img src="icon/delete.png" class="btn-icon"> Pop
        </button>
      </div>
    </div>

    <div class="search-box">
      <img src="icon/search.png" class="search-icon">
      <input id="searchTask" onkeyup="filterTasks()" placeholder="Cari kelar-in...">
    </div>
  `;

  if (kelarIn.length === 0) {
    html += `<div class="empty">Stack kosong</div>`;
  } else {
    [...kelarIn].reverse().forEach((t, i) => {
      const index = kelarIn.length - 1 - i;

      html += `
        <div class="task">
          <input type="checkbox" ${t.done ? 'checked' : ''} onclick="toggleStatus(${index})">
          <span>${t.text}</span>
        </div>
      `;
    });
  }

  html += `</div>`;
  content.innerHTML = html;
}

// ================= ADD =================
function showAdd() {
  content.innerHTML = `
    <div class="card">
      <input id="todoInput" placeholder="Tambah tugas">
      <input type="datetime-local" id="deadlineInput">
      <button onclick="addTodo()">Tambah</button>
    </div>
  `;
}

// ================= ACTION =================
function addTodo() {
  const input = document.getElementById("todoInput");
  const dateInput = document.getElementById("deadlineInput");

  if (!input.value.trim()) return;

  kelarIn.push({
    text: input.value.trim(),
    deadline: dateInput.value || "Tanpa Deadline",
    done: false,
    notified: false
  });

  input.value = "";
  save();
  showTasks();
}

function removeTodo() {
  if (kelarIn.length === 0) return alert("Stack kosong!");

  const removed = kelarIn.pop();
  undoStack.push(removed);
  history.push(removed);

  save();
  showTasks();
}

function undoRemove() {
  if (undoStack.length === 0) return alert("Tidak ada undo!");

  const restored = undoStack.pop();
  kelarIn.push(restored);

  save();
  showTasks();
}

function toggleStatus(index) {
  kelarIn[index].done = !kelarIn[index].done;
  save();
  showTasks();
}

// ================= SEARCH =================
function filterTasks() {
  const keyword = document.getElementById("searchTask").value.toLowerCase();
  const tasks = document.querySelectorAll(".task");

  tasks.forEach(t => {
    t.style.display = t.innerText.toLowerCase().includes(keyword) ? "block" : "none";
  });
}

// ================= LOGOUT =================
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

// ================= LOAD =================
window.onload = () => {
  if (isDashboard && content) showHome();
};