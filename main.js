// ================= DATA & STATE =================
const isDashboard = window.location.pathname.includes("dashboard.html");
const content = document.querySelector(".content");
let todos = JSON.parse(localStorage.getItem("todos")) || [];

function save() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// ================= USER INFO =================
const userName = document.getElementById("userName");
if (userName) {
  userName.innerText = "👋 Hi, " + (localStorage.getItem("user") || "User");
}

// ================= LOGIN & LOGOUT =================
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

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

// ================= VIEW: DASHBOARD =================
function showDashboard() {
  if (!content) return;
  const title = document.getElementById("pageTitle");
  if (title) title.innerText = "Dashboard";

  content.innerHTML = `
    <div class="card big">
      <h3>Selamat Datang ✨</h3>
      <p>Kelola tugas kuliahmu dengan sistem Stack (LIFO).</p>
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
    </div>
  `;
}

// ================= VIEW: TAMBAH TUGAS (PUSH) =================
function showAdd() {
  if (!content) return;
  const title = document.getElementById("pageTitle");
  if (title) title.innerText = "Tambah Tugas";

  content.innerHTML = `
    <div class="card">
      <h3>Tambah Tugas Baru</h3>
      <input id="todoInput" placeholder="Ketik tugas di sini..." />
      <button class="btn-login" onclick="addTodo()">Push ke Stack</button>
    </div>
  `;
}

// ================= VIEW: DAFTAR TUGAS (LIFO DISPLAY) =================
function showTasks() {
  if (!content) return;
  const title = document.getElementById("pageTitle");
  if (title) title.innerText = "Daftar Tugas";

  let html = `<div class="header">Tumpukan Tugas (Terbaru di Atas)</div>`;

  if (todos.length === 0) {
    html += `<div class="empty">Tumpukan kosong 😴</div>`;
  } else {
    // Membalik urutan (reverse) untuk simulasi Stack/LIFO di UI
    [...todos].reverse().forEach((t, i) => {
      const isTop = (i === 0) ? '<span class="badge">TOP</span>' : '';
      html += `
        <div class="task ${i === 0 ? 'top-task' : ''}">
          <span>${t.text} ${isTop}</span>
        </div>
      `;
    });
  }
  content.innerHTML = html;
}

// ================= CORE ACTIONS (STACK OPS) =================

function addTodo() {
  const input = document.getElementById("todoInput");
  if (!input || !input.value.trim()) return;

  // PUSH: Menambah ke urutan terakhir array
  todos.push({ text: input.value, done: false });
  
  save();
  input.value = "";
  alert("Tugas berhasil di-push!");
  showTasks(); // Pindah ke list untuk lihat hasilnya
}

function removeTodo() {
  if (todos.length === 0) {
    alert("Stack Kosong!");
    return;
  }

  // POP: Menghapus elemen paling terakhir (LIFO)
  const removed = todos.pop();
  alert("Pop Berhasil! Tugas diselesaikan: " + removed.text);

  save();
  // Refresh tampilan tergantung halaman aktif
  const title = document.getElementById("pageTitle");
  if (title && title.innerText === "Daftar Tugas") {
    showTasks();
  } else {
    showDashboard();
  }
}

// ================= LOAD AWAL =================
if (isDashboard && content) {
  showDashboard();
}