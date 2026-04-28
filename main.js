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

// ================= DATA (DATABASE LOKAL) =================
const content = document.querySelector(".content");
let todos = JSON.parse(localStorage.getItem("todos")) || [];

function save() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// ================= VIEW: DASHBOARD =================
function showDashboard() {
  const title = document.getElementById("pageTitle");
  if (title) title.innerText = "Dashboard";
  if (!content) return;

  const total = todos.length;
  const doneCount = todos.filter(t => t.done).length;
  const pendingCount = total - doneCount;
  const progressPercent = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  content.innerHTML = `
    <div class="card big">
      <h3>Selamat Datang ✨</h3>
      <p>Kelola tugasmu dengan sistem Stack (LIFO).</p>
    </div>

    <div class="grid">
      <div class="card">
        <h4>📌 Total Tugas</h4>
        <div class="number">${total}</div>
      </div>
      <div class="card">
        <h4>⏳ Belum</h4>
        <div class="number">${pendingCount}</div>
      </div>
      <div class="card">
        <h4>✅ Selesai</h4>
        <div class="number">${doneCount}</div>
      </div>
    </div>
  `;
}

// ================= VIEW: TASK =================
function showTasks() {
  const title = document.getElementById("pageTitle");
  if (title) title.innerText = "Daftar Tugas";
  if (!content) return;

  let html = `
    <div class="card">
      <div style="display:flex; justify-content:space-between;">
        <h3>Stack (LIFO)</h3>
        <button onclick="removeTodo()">Pop</button>
      </div>
  `;

  if (todos.length === 0) {
    html += `<div class="empty">Kosong</div>`;
  } else {
    [...todos].reverse().forEach((t, i) => {
      const originalIndex = todos.length - 1 - i;
      const isTop = i === 0 ? "🔝" : "";

      html += `
        <div style="margin:10px 0;">
          <input type="checkbox" ${t.done ? "checked" : ""} onclick="toggleStatus(${originalIndex})">
          
          <span style="${t.done ? "text-decoration:line-through" : ""}">
            ${t.text} ${isTop}
          </span>

          <br>

          <!-- === TAMBAHAN DEADLINE === -->
          <small>
            📅 ${t.deadline || "-"} | ${getDeadlineStatus(t.deadline)}
          </small>
        </div>
      `;
    });
  }

  html += `</div>`;
  content.innerHTML = html;
}

// ================= VIEW: TAMBAH =================
function showAdd() {
  const title = document.getElementById("pageTitle");
  if (title) title.innerText = "Tambah";
  if (!content) return;

  content.innerHTML = `
    <div class="card">
      <h3>Tambah Tugas</h3>

      <input id="todoInput" placeholder="Tugas..." />
      <br><br>

      <!-- === TAMBAHAN INPUT DEADLINE === -->
      <input type="date" id="deadlineInput" />
      <br><br>

      <button onclick="addTodo()">Tambah</button>
    </div>
  `;
}

// ================= CORE STACK =================

function addTodo() {
  const input = document.getElementById("todoInput");
  const deadlineInput = document.getElementById("deadlineInput");

  if (!input || !input.value.trim()) {
    alert("Isi tugas!");
    return;
  }

  todos.push({
    text: input.value.trim(),
    done: false,

    // === TAMBAHAN DEADLINE ===
    deadline: deadlineInput ? deadlineInput.value : ""
  });

  input.value = "";
  save();
  showTasks();
}

function removeTodo() {
  if (todos.length === 0) {
    alert("Kosong!");
    return;
  }

  const removed = todos.pop();
  alert("Hapus: " + removed.text);

  save();
  showTasks();
}

function toggleStatus(index) {
  todos[index].done = !todos[index].done;
  save();
  showTasks();
}

// ================= TAMBAHAN FUNCTION DEADLINE =================
function getDeadlineStatus(deadline) {
  if (!deadline) return "";

  const today = new Date();
  const due = new Date(deadline);

  const diff = (due - today) / (1000 * 60 * 60 * 24);

  if (diff < 0) return "❌ Terlambat";
  if (diff <= 1) return "⚠️ Mendekati";
  return "⏳ Aman";
}

// ================= LOGOUT =================
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

// ================= LOAD =================
window.onload = () => {
  if (isDashboard && content) {
    showDashboard();
  }
};