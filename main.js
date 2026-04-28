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
// Konsisten menggunakan satu variabel 'todos'
let todos = JSON.parse(localStorage.getItem("todos")) || [];

function save() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

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

// ================= TASK (TAMPILAN STACK - LIFO) =================
function showTasks() {
  const title = document.getElementById("pageTitle");
  if (title) title.innerText = "Tugas";

  if (!content) return;

  // Inisialisasi awal HTML
  let html = `
    <div class="card">
      <h3>Daftar Tugas (STACK - LIFO)</h3>
  `;

  if (todos.length === 0) {
    html += `<div class="empty">Tumpukan kosong, silakan tambah tugas ✨</div>`;
  } else {
    // LIFO: Membalik urutan agar yang terakhir masuk muncul di atas
    [...todos].reverse().forEach((t, i) => {
      const isTop = (i === 0) ? '<span class="badge" style="background:#a0c4ff; color:white; padding:2px 8px; border-radius:10px; font-size:10px; margin-left:10px;">TERATAS</span>' : '';
      
      html += `
        <div class="task ${i === 0 ? 'top-task' : ''}" style="border-bottom:1px solid #eee; padding:10px 0; display:flex; justify-content:space-between;">
          <span>${t.text} ${isTop}</span>
          <small style="color:#aaa;">${t.done ? 'Selesai' : 'Tumpukan'}</small>
        </div>
      `;
    });
  }

  html += `</div>`; // Menutup tag <div class="card">
  content.innerHTML = html;
}

// ================= ADD PAGE =================
function showAdd() {
  const title = document.getElementById("pageTitle");
  if (title) title.innerText = "Tambah";

  if (!content) return;

  content.innerHTML = `
    <div class="piano-bg"></div>
    <div class="card">
      <h3>Tambah Tugas</h3>
      <input id="todoInput" placeholder="Tulis tugas..." />
      <button class="btn-login" onclick="addTodo()">Push ke Stack</button>
    </div>
  `;
}

// ================= ACTION (LOGIC STACK) =================

// PUSH: Menambah tugas
function addTodo() {
  const input = document.getElementById("todoInput");
  if (!input || !input.value.trim()) return;

  todos.push({
    text: input.value,
    done: false
  });

  input.value = "";
  save();
  showTasks(); // Langsung lihat daftar setelah nambah
}

// POP: Menghapus tugas terakhir (LIFO)
function removeTodo() {
  if (todos.length === 0) {
    alert("Stack kosong! Tidak ada tugas yang bisa dihapus.");
    return;
  }

  // Mengambil elemen terakhir
  const removed = todos.pop();
  alert("Berhasil menghapus tugas teratas: " + removed.text);

  save();
  showTasks();
}

// TOGGLE: Menandai selesai (Opsional)
function toggle(i) {
  if (todos[i]) {
    todos[i].done = !todos[i].done;
    save();
    showTasks();
  }
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