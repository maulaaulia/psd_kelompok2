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

// ================= VIEW: HOME =================
function showHome() {
  const title = document.getElementById("pageTitle");
  if (title) title.innerText = "Home";
  if (!content) return;

  const last = todos[todos.length - 1];

  content.innerHTML = `
    <div class="card">
      <h3>🏠 Home</h3>
      ${
        !last
          ? `<div class="empty">Belum ada tugas ✨</div>`
          : `
            <button class="task-row" onclick="showTasks()" style="width:100%; text-align:left; border:none; background:none; cursor:pointer;">
              <div class="task-text">
                <b>Tugas Terakhir (Top Stack)</b><br>
                ${last.text}
              </div>
            </button>
          `
      }
    </div>
  `;
}

// ================= VIEW: DASHBOARD (STATISTIK) =================
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
    </div>
  `;
}

// ================= VIEW: TASK (LIFO) =================
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
    html += `<div class="empty">Tumpukan kosong ✨</div>`;
  } else {
    [...todos].reverse().forEach((t, i) => {
      const originalIndex = todos.length - 1 - i;
      const isTop = (i === 0) ? '<span class="badge" style="background:#a0c4ff; color:white; padding:2px 8px; border-radius:10px; font-size:10px; margin-left:10px;">TOP</span>' : '';
      
      html += `
        <div class="task" style="border-bottom:1px solid #eee; padding:15px 0;">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <div style="display: flex; align-items: center;">
              <input type="checkbox" ${t.done ? 'checked' : ''} onclick="toggleStatus(${originalIndex})" style="margin-right: 12px; transform: scale(1.2); cursor: pointer;">
              <span style="font-size: 15px; ${t.done ? 'text-decoration: line-through; color: #bbb;' : ''}">
                ${t.text} ${isTop}
              </span>
            </div>
            <small style="color: #bdb2ff; font-weight: bold;">⏰ ${t.deadline || 'Tanpa Deadline'}</small>
          </div>
        </div>
      `;
    });
  }

  html += `</div>`; 
  content.innerHTML = html;
}

// ================= VIEW: TAMBAH (PUSH) =================
function showAdd() {
  const title = document.getElementById("pageTitle");
  if (title) title.innerText = "Tambah Tugas & Deadline";
  if (!content) return;

  content.innerHTML = `
    <div class="card">
      <h3>Push ke Stack</h3>
      <input id="todoInput" placeholder="Tulis tugas baru..." style="width: 100%; padding: 12px; margin-top: 15px; border-radius: 10px; border: 1px solid #ddd;" />
      <p style="margin-top: 15px; font-size: 13px; font-weight: bold;">📅 Atur Deadline:</p>
      <input type="date" id="deadlineInput" style="width: 100%; padding: 12px; margin-bottom: 15px; border-radius: 10px; border: 1px solid #ddd;" />
      <button onclick="addTodo()" style="width: 100%; background: #bdb2ff; color: white; border: none; padding: 12px; border-radius: 10px; cursor: pointer; font-weight: bold;">
        Tambahkan (Push)
      </button>
    </div>
  `;
}

// ================= VIEW: CALENDAR (BARU) =================
function showCalendar() {
  const title = document.getElementById("pageTitle");
  if (title) title.innerText = "Calendar & Deadline";
  if (!content) return; 

  const sortedTasks = todos
    .filter(t => t.deadline && t.deadline !== "Tanpa Deadline" && !t.done)
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

  let html = `
    <div class="card">
      <h3>📅 Pengingat Deadline</h3>
      <p style="font-size: 13px; color: #666; margin-bottom: 20px;">Tugas diurutkan dari yang paling mendesak.</p>
  `;

  if (sortedTasks.length === 0) {
    html += `<div class="empty">Tidak ada deadline aktif ✨</div>`;
  } else {
    sortedTasks.forEach(t => {
      const diffTime = new Date(t.deadline) - new Date();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const statusColor = diffDays <= 2 ? "#ffadad" : "#a0c4ff";

      html += `
        <div style="border-left: 5px solid ${statusColor}; background: #f9f9f9; padding: 15px; margin-bottom: 10px; border-radius: 0 10px 10px 0;">
          <div style="display: flex; justify-content: space-between;">
            <strong>${t.text}</strong>
            <span style="color: ${statusColor}; font-weight: bold;">
              ${diffDays < 0 ? 'Terlewat' : diffDays + ' Hari lagi'}
            </span>
          </div>
          <small>Deadline: ${t.deadline}</small>
        </div>
      `;
    });
  }

  html += `</div>`;
  content.innerHTML = html;
}

// ================= CORE ACTIONS =================
function addTodo() {
  const input = document.getElementById("todoInput");
  const dateInput = document.getElementById("deadlineInput");
  if (!input || !input.value.trim()) return;

  todos.push({
    text: input.value.trim(),
    deadline: dateInput.value || "Tanpa Deadline",
    done: false
  });

  input.value = "";
  if(dateInput) dateInput.value = "";
  save();
  showTasks(); 
}

function removeTodo() {
  if (todos.length === 0) return alert("Stack kosong!");
  const removed = todos.pop();
  alert("Pop Berhasil! Menghapus: " + removed.text);
  save();
  showTasks();
}

function toggleStatus(index) {
  todos[index].done = !todos[index].done;
  save();
  showTasks();
}

function logout() {
  localStorage.clear();
  window.location.href = "index.html";
}

function setActive(btn) {
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}

window.onload = () => {
  if (isDashboard && content) showHome();
};