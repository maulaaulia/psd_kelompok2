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
if (window.location.pathname.includes("dashboard.html")) {
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
  document.getElementById("pageTitle").innerText = "Dashboard";

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
  const reversed = todos.slice().reverse();

  content.innerHTML = `
    <div class="card">
      <h3>Daftar Tugas (STACK - LIFO)</h3>

      ${
        todos.length === 0
          ? `<div class="empty">Belum ada tugas 🥱</div>`
          : todos.map((t, i) => `
            <div style="display:flex; justify-content:space-between; margin:10px 0;">
              <span style="text-decoration:${t.done ? 'line-through' : 'none'}">
                ${t.text}
              </span>
              <div>
                <button onclick="toggle(${i})">✔</button>
                <button onclick="removeTodo(${i})">❌</button>
              </div>
            </div>
          `).join("")
      }
    </div>
  `;
}
  


// ================= ADD =================
function showAdd() {
  document.getElementById("pageTitle").innerText = "Tambah";

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
  if (!input.value.trim()) return;

  todos.push({ text: input.value, done: false });
  input.value = "";

  save();
  showTasks();
}

function toggle(i) {
  todos[i].done = !todos[i].done;
  save();
  showTasks();
}

function removeTodo() {
  todos.pop();
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
function keluar() {
  if (confirm("Yakin mau keluar?")) {
    localStorage.removeItem("todos");
    location.reload();
  }
}
function popTodo() {
  if (todos.length === 0) {
    alert("Stack kosong!");
    return;
  }

  let removed = todos.pop(); // LIFO
  save();

  alert("Menghapus tugas terakhir: " + removed.text);
  showTasks();
}