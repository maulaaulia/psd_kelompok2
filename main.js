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

  content.innerHTML = `
    <div class="card big">
      <h3>Selamat Datang ✨</h3>
      <p>Kelola tugasmu dengan sistem Stack (LIFO). Tugas terbaru selalu di posisi teratas!</p>
    </div>

    <div class="grid">
      <div class="card">
        <h4>📌 Total Tugas</h4>
        <div class="number">${todos.length}</div>
      </div>
      <div class="card">
        <h4>⏳ Status</h4>
        <div class="number" style="font-size: 18px;">${todos.length > 0 ? 'Aktif' : 'Kosong'}</div>
      </div>
    </div>
  `;
}

// ================= VIEW: TASK (LIFO DISPLAY) =================
function showTasks() {
  const title = document.getElementById("pageTitle");
  if (title) title.innerText = "Daftar Tugas";
  if (!content) return;

  // Inisialisasi awal HTML dengan tombol Hapus Teratas (POP)
  let html = `
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h3>Tumpukan Tugas</h3>
        <button onclick="removeTodo()" style="background: #ffadad; color: white; border: none; padding: 8px 12px; border-radius: 10px; cursor: pointer;">
          🗑️ Hapus Teratas (Pop)
        </button>
      </div>
  `;

  if (todos.length === 0) {
    html += `<div class="empty">Tumpukan kosong, silakan tambah tugas ✨</div>`;
  } else {
    // [...todos].reverse() membuat data terbaru (indeks terakhir) muncul paling atas
    [...todos].reverse().forEach((t, i) => {
      const isTop = (i === 0) ? '<span class="badge" style="background:#a0c4ff; color:white; padding:2px 8px; border-radius:10px; font-size:10px; margin-left:10px;">TOP OF STACK</span>' : '';
      
      html += `
        <div class="task ${i === 0 ? 'top-task' : ''}" style="border-bottom:1px solid #eee; padding:15px 0; display:flex; justify-content:space-between; align-items: center;">
          <span style="font-size: 15px;">${t.text} ${isTop}</span>
          <small style="color:#bbb;">Indeks: ${todos.length - 1 - i}</small>
        </div>
      `;
    });
  }

  html += `</div>`; 
  content.innerHTML = html;
}

// ================= VIEW: TAMBAH (PUSH PAGE) =================
function showAdd() {
  const title = document.getElementById("pageTitle");
  if (title) title.innerText = "Tambah";
  if (!content) return;

  content.innerHTML = `
    <div class="card">
      <h3>Push ke Stack</h3>
      <p style="color: #888; font-size: 13px;">Tugas yang kamu masukkan akan menjadi tumpukan teratas.</p>
      <input id="todoInput" placeholder="Tulis tugas baru..." style="width: 100%; padding: 12px; margin: 15px 0; border-radius: 10px; border: 1px solid #ddd;" />
      <button class="btn-login" onclick="addTodo()" style="width: 100%; background: #bdb2ff; color: white; border: none; padding: 12px; border-radius: 10px; cursor: pointer;">
        Tambahkan (Push)
      </button>
    </div>
  `;
}

// ================= CORE ACTION (LOGIKA STACK) =================

// 1. PUSH: Menambah elemen ke posisi terakhir
function addTodo() {
  const input = document.getElementById("todoInput");
  if (!input || !input.value.trim()) {
    alert("Isi tugas dulu ya!");
    return;
  }

  todos.push({
    text: input.value.trim(),
    done: false
  });

  input.value = "";
  save();
  showTasks(); // Pindah ke daftar untuk melihat tumpukan
}

// 2. POP: Menghapus elemen paling terakhir (LIFO)
function removeTodo() {
  if (todos.length === 0) {
    alert("Stack kosong! Tidak ada tugas yang bisa dihapus.");
    return;
  }

  // Mengambil dan menghapus elemen terakhir dari array
  const removed = todos.pop();
  alert("Pop Berhasil! Menghapus tugas teratas: " + removed.text);

  save();
  showTasks();
}

// ================= LOGOUT =================
function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

// ================= MENU NAVIGATION =================
function setActive(btn) {
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

// ================= LOAD DEFAULT =================
window.onload = () => {
  if (isDashboard && content) {
    showDashboard();
  }
};