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

// ================= VIEW: DASHBOARD (DENGAN STATISTIK) =================
function showDashboard() {
  const title = document.getElementById("pageTitle");
  if (title) title.innerText = "Dashboard";
  if (!content) return;

  // Hitung Data untuk Statistik
  const total = todos.length;
  const doneCount = todos.filter(t => t.done).length;
  const pendingCount = total - doneCount;
  const progressPercent = total === 0 ? 0 : Math.round((doneCount / total) * 100);

  content.innerHTML = `
    <div class="card big">
      <h3>Selamat Datang ✨</h3>
      <p>Kelola tugasmu dengan sistem Stack (LIFO). Tugas terbaru selalu berada di puncak tumpukan!</p>
    </div>

    <div class="grid">
      <div class="card">
        <h4>📌 Total Tugas</h4>
        <div class="number">${total}</div>
      </div>
      <div class="card">
        <h4>⏳ Belum Selesai</h4>
        <div class="number" style="color: #ffadad;">${pendingCount}</div>
      </div>
      <div class="card">
        <h4>✅ Sudah Selesai</h4>
        <div class="number" style="color: #a0c4ff;">${doneCount}</div>
      </div>
    </div>

    <div class="card" style="margin-top: 20px;">
      <h4>📊 Progres Penyelesaian</h4>
      <div style="background: #f0f0f0; border-radius: 20px; height: 30px; width: 100%; margin: 15px 0; overflow: hidden; border: 1px solid #eee;">
        <div style="background: linear-gradient(90deg, #bdb2ff, #a0c4ff); height: 100%; width: ${progressPercent}%; transition: width 0.6s ease-in-out; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px;">
          ${progressPercent}%
        </div>
      </div>
      <p style="font-size: 13px; color: #777;">
        Kamu telah menyelesaikan <b>${doneCount}</b> dari <b>${total}</b> tugas yang ada dalam memori.
      </p>
    </div>
  `;
}

// ================= VIEW: TASK (LIFO DISPLAY) =================
function showTasks() {
  const title = document.getElementById("pageTitle");
  if (title) title.innerText = "Daftar Tugas";
  if (!content) return;

  let html = `
    <div class="card">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
        <h3>Tumpukan Tugas (LIFO)</h3>
        <button onclick="removeTodo()" style="background: #ffadad; color: white; border: none; padding: 8px 12px; border-radius: 10px; cursor: pointer; font-weight: bold;">
          🗑️ Pop Teratas
        </button>
      </div>
  `;

  if (todos.length === 0) {
    html += `<div class="empty">Tumpukan kosong, silakan tambah tugas ✨</div>`;
  } else {
    // [...todos].reverse() membuat data terbaru muncul paling atas secara visual
    [...todos].reverse().forEach((t, i) => {
      const originalIndex = todos.length - 1 - i;
      const isTop = (i === 0) ? '<span class="badge" style="background:#a0c4ff; color:white; padding:2px 8px; border-radius:10px; font-size:10px; margin-left:10px;">TOP</span>' : '';
      
      html += `
        <div class="task ${i === 0 ? 'top-task' : ''}" style="border-bottom:1px solid #eee; padding:15px 0; display:flex; justify-content:space-between; align-items: center;">
          <div style="display: flex; align-items: center;">
            <input type="checkbox" ${t.done ? 'checked' : ''} onclick="toggleStatus(${originalIndex})" style="margin-right: 12px; transform: scale(1.2); cursor: pointer;">
            <span style="font-size: 15px; ${t.done ? 'text-decoration: line-through; color: #bbb;' : ''}">${t.text} ${isTop}</span>
          </div>
          <small style="color:#ccc;">#${originalIndex}</small>
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
      <button class="btn-login" onclick="addTodo()" style="width: 100%; background: #bdb2ff; color: white; border: none; padding: 12px; border-radius: 10px; cursor: pointer; font-weight: bold;">
        Tambahkan (Push)
      </button>
    </div>
  `;
}

// ================= CORE ACTION (LOGIKA STACK) =================

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
  showTasks(); 
}

function removeTodo() {
  if (todos.length === 0) {
    alert("Stack kosong! Tidak ada tugas yang bisa dihapus.");
    return;
  }

  const removed = todos.pop();
  alert("Pop Berhasil! Menghapus tugas teratas: " + removed.text);

  save();
  showTasks();
}

// Fitur Tambahan: Mengubah status selesai/belum
function toggleStatus(index) {
  todos[index].done = !todos[index].done;
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