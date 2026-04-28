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

// ================= DATA (BACKEND LOGIC) =================
const content = document.querySelector(".content");
// Kita pakai satu nama variabel saja: 'todos' agar tidak bentrok
let todos = JSON.parse(localStorage.getItem("todos")) || [];

function save() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// ================= DASHBOARD VIEW =================
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

// ================= TASK VIEW (LIFO DISPLAY) =================
function showTasks() {
  const title = document.getElementById("pageTitle");
  if (title) title.innerText = "Daftar Tugas";

  if (!content) return;

  let html = `<div class="header">Daftar Tugas (Stack System)</div>`;

  if (todos.length === 0) {
    html += `<div class="empty">Tumpukan kosong, silakan tambah tugas ✨</div>`;
  } else {
    // Kita balik urutannya (reverse) supaya tugas terbaru ada di paling atas (LIFO)
    [...todos].reverse().forEach((t, i) => {
      const isTop = (i === 0) ? '<span class="badge">TERATAS</span>' : '';
      
      html += `
        <div class="task ${i === 0 ? 'top-task' : ''}">
          <span>${t.text} ${isTop}</span>
        </div>
      `;
    });
  }

  content.innerHTML = html;
}

// ================= ADD VIEW =================
function showAdd() {
  const title = document.getElementById("pageTitle");
  if (title) title.innerText = "Tambah Tugas";

  if (!content) return;

  content.innerHTML = `
    <div class="card">
      <h3>Tambah Tugas</h3>
      <input id="todoInput" placeholder="Tulis tugas..." />
      <button class="btn-login" onclick="addTodo()">Push ke Stack</button>
    </div>
  `;
}

// ================= ACTION (STACK OPERATIONS) =================

// 1. PUSH: Menambah tugas ke tumpukan paling atas
function addTodo() {
  const input = document.getElementById("todoInput");
  if (!input || !input.value.trim()) return;

  todos.push({
    text: input.value,
    done: false
  });

  input.value = "";
  save();
  showTasks(); // Langsung pindah ke halaman list setelah push
  alert("Berhasil menambahkan tugas!");
}

// 2. POP: Menghapus tugas terakhir yang dimasukkan (LIFO)
function removeTodo() {
  if (todos.length === 0) {
    alert("Stack kosong! Tidak ada yang bisa dihapus.");
    return;
  }

  const removed = todos.pop(); // Fungsi asli Stack LIFO
  alert("Berhasil menyelesaikan tugas teratas: " + removed.text);

  save();
  showTasks();
}

// ================= LOGOUT =================
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

// ================= DEFAULT LOAD =================
if (isDashboard && content) {
  showDashboard();
}