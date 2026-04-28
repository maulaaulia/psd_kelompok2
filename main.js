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
let todos = JSON.parse(localStorage.getItem("todos")) || [];

// ================= DASHBOARD =================
function showDashboard() {
  const title = document.getElementById("pageTitle");
  if (title) title.innerText = "Dashboard";

  if (!content) return;

  content.innerHTML = `
    <div class="card big">
      <h3>Selamat Datang ✨</h3>
      <p>Mulai atur tugasmu hari ini dengan lebih rapi dan produktif.</p>
    </div>

    <div class="grid">
      <div class="card">
        <h4>📌 Total Tugas</h4>
        <div class="number">${todos.length}</div>
      </div>
      <div class="card">
        <h4>✅ Selesai</h4>
        <div class="number">${todos.filter(t => t.done).length}</div>
      </div>
      <div class="card">
        <h4>⏳ Belum</h4>
        <div class="number">${todos.filter(t => !t.done).length}</div>
      </div>
    </div>
  `;
}

// ================= TASK =================
function showTasks() {
  const title = document.getElementById("pageTitle");
  if (title) title.innerText = "Tugas";

  if (!content) return;

  content.innerHTML = `
    <div class="card">
      <h3>Daftar Tugas (STACK - LIFO)</h3>

      ${
        todos.length === 0
          ? `<div class="empty">Belum ada tugas 🥱</div>`
          : todos
              .map((t, i) => `
                <div class="task-row">
                  <span class="task-text ${t.done ? 'done' : ''}">
                    ${t.text}
                  </span>

                  <button class="icon-btn done-btn" onclick="toggle(${i})">✔</button>
                  <button class="icon-btn delete-btn" onclick="removeTodo()">✖</button>
                </div>
              `)
              .reverse()
              .join("")
      }
    </div>
  `;
}

// ================= ADD =================
function showAdd() {
  const title = document.getElementById("pageTitle");
  if (title) title.innerText = "Tambah";

  if (!content) return;

  content.innerHTML = `
    <div class="piano-bg"></div>

    <div class="card">
      <h3>Tambah Tugas</h3>
      <input id="todoInput" placeholder="Tulis tugas..." />
      <button class="btn-login" onclick="addTodo()">Tambah</button>
    </div>
  `;
}

// ================= ACTION =================
function addTodo() {
  const input = document.getElementById("todoInput");
  if (!input || !input.value.trim()) return;

  todos.push({
    text: input.value,
    done: false
  });

  input.value = "";
  save();
  showTasks();
}

function toggle(i) {
  todos[i].done = !todos[i].done;
  save();
  showTasks();
}

// LIFO (STACK)
function removeTodo() {
  if (todos.length === 0) {
    alert("Stack kosong!");
    return;
  }

  const removed = todos.pop();
  alert("Menghapus tugas terakhir: " + removed.text);

  save();
  showTasks();
}

function save() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// ================= LOGOUT =================
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

// ================= ACTIVE MENU =================
function setActive(btn) {
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

// ================= DEFAULT LOAD =================
if (isDashboard && content) {
  showDashboard();
}