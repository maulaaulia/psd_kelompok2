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

// ================= VIEW: HOME (TAMPILAN LOGIN STYLE) =================
function showHome() {
  const title = document.getElementById("pageTitle");
  if (title) title.innerText = "Home";
  if (!content) return;

  const lastTask = todos.length > 0 ? todos[todos.length - 1] : null;

  content.innerHTML = `
    <div class="card big" style="text-align: center; padding: 40px 20px;">
      <img src="img/logo.png" style="width: 80px; margin-bottom: 20px;">
      <h2 style="color: #444;">Selamat Datang Kembali! ✨</h2>
      <p style="color: #777; margin-bottom: 30px;">Siap untuk menyelesaikan tugasmu hari ini dengan sistem LIFO?</p>
      
      <div class="grid" style="margin-top: 20px;">
        <div class="card" style="background: #fdfdfd; cursor: pointer;" onclick="showTasks()">
          <h4>📂 Lihat Tugas</h4>
          <p style="font-size: 12px;">Cek tumpukan tugasmu</p>
        </div>
        <div class="card" style="background: #fdfdfd; cursor: pointer;" onclick="showAdd()">
          <h4>➕ Tambah Baru</h4>
          <p style="font-size: 12px;">Push tugas ke stack</p>
        </div>
      </div>

      ${
        lastTask
          ? `
          <div style="margin-top: 30px; padding: 20px; border-top: 2px dashed #eee;">
            <p style="font-size: 14px; font-weight: bold; color: #bdb2ff;">📌 TUGAS TERAKHIR DI STACK:</p>
            <h3 style="margin: 10px 0;">${lastTask.text}</h3>
            <small>⏰ Deadline: ${lastTask.deadline}</small>
          </div>
          `
          : `<div class="empty" style="margin-top: 20px;">Belum ada tugas di tumpukan 🥱</div>`
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
      <h3>Statistik Tugas ✨</h3>
      <p>Pantau progres tumpukan tugasmu di sini.</p>
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
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
      <h3>Tumpukan Tugas (LIFO)</h3>
      <button onclick="removeTodo()" style="background:#ffadad; color:white; border:none; padding:8px 12px; border-radius:10px; cursor:pointer; font-weight:bold;">
        🗑️ Pop Teratas
      </button>
    </div>

    <input 
      type="text" 
      id="searchTask" 
      placeholder="🔍 Cari tugas..." 
      onkeyup="filterTasks()" 
      style="width:98%; padding:10px; border-radius:10px; border:1px solid #ddd; margin-bottom:15px;"
    >
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
            <small style="color: #bdb2ff; font-weight: bold;">⏰ ${t.deadline}</small>
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
  if (title) title.innerText = "Tambah Tugas";
  if (!content) return;

  content.innerHTML = `
    <div class="card add-modern">
      <h3>✨ Tambah Tugas Baru</h3>
      <div class="form-group" style="margin-top: 20px;">
        <label style="display: block; margin-bottom: 8px; font-weight: bold;">Judul Tugas</label>
        <input id="todoInput" placeholder="Contoh: Belajar Stack..." style="width: 95%; padding: 12px; border: 1px solid #ddd; border-radius: 10px;" />
      </div>

      <div class="form-group" style="margin-top: 15px;">
        <label style="display: block; margin-bottom: 8px; font-weight: bold;">Tanggal Deadline</label>
        <input type="date" id="deadlineInput" style="width: 95%; padding: 12px; border: 1px solid #ddd; border-radius: 10px;" />
      </div>

      <button class="nav-btn" onclick="addTodo()" style="width: 100%; background: #bdb2ff; color: white; border: none; padding: 15px; border-radius: 10px; margin-top: 20px; cursor: pointer; font-weight: bold;">
        ➕ Tambahkan ke Stack
      </button>
    </div>
  `;
}

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
      const now = new Date();
      const target = new Date(t.deadline);
      const diffTime = target - now; // Hasil dalam milidetik

      let timeText = "";
      let statusColor = "#a0c4ff"; // Default Biru

      if (diffTime < 0) {
        // JIKA TERLEWAT
        timeText = "Terlambat";
        statusColor = "#ff4d4d"; // Merah tegas
      } else {
        // HITUNG HARI, JAM, MENIT
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffHours = Math.floor((diffTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffTime % (1000 * 60 * 60)) / (1000 * 60));

        if (diffDays > 0) {
          timeText = `${diffDays} Hari ${diffHours} Jam lagi`;
        } else if (diffHours > 0) {
          timeText = `${diffHours} Jam ${diffMinutes} Menit lagi`;
        } else {
          timeText = `${diffMinutes} Menit lagi`;
        }

        // Warna peringatan jika mepet (kurang dari 1 hari)
        if (diffDays < 1) statusColor = "#ffadad"; 
      }

      html += `
        <div style="border-left: 5px solid ${statusColor}; background: #f9f9f9; padding: 15px; margin-bottom: 10px; border-radius: 0 10px 10px 0;">
          <div style="display: flex; justify-content: space-between;">
            <strong>${t.text}</strong>
            <span style="color: ${statusColor}; font-weight: bold;">
              ${timeText}
            </span>
          </div>
          <small>Deadline: ${t.deadline.replace('T', ' ')}</small>
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
  const dateInput = document.getElementById("deadlineInput"); // Sudah sama dengan ID di HTML

  if (!input || !input.value.trim()) return;

  // Pastikan ada nilai deadline, jika kosong beri default
  const deadlineValue = dateInput.value || "Tanpa Deadline";

  todos.push({
    text: input.value.trim(),
    deadline: deadlineValue,
    done: false
  });

  input.value = "";
  if (dateInput) dateInput.value = "";

  save();
  showTasks(); // Langsung pindah ke halaman tugas setelah tambah
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
// Tambahkan di bagian atas bersama data lainnya
let history = JSON.parse(localStorage.getItem("todoHistory")) || [];

// Modifikasi fungsi save() agar menyimpan history juga
function save() {
  localStorage.setItem("todos", JSON.stringify(todos));
  localStorage.setItem("todoHistory", JSON.stringify(history));
}

// ================= VIEW: STATS & HISTORY (BARU) =================
function showStats() {
  const title = document.getElementById("pageTitle");
  if (title) title.innerText = "Statistik & Riwayat";
  if (!content) return;

  const totalCreated = todos.length + history.length;
  const totalDone = todos.filter(t => t.done).length + history.filter(t => t.done).length;

  content.innerHTML = `
    <div class="card big">
      <h3>📊 Statistik Penggunaan</h3>
      <p>Laporan aktivitas tugas kamu selama ini.</p>
    </div>

    <div class="grid">
      <div class="card">
        <h4>📝 Total Input</h4>
        <div class="number">${totalCreated}</div>
        <small>Semua tugas yang pernah dibuat</small>
      </div>
      <div class="card">
        <h4>✅ Total Selesai</h4>
        <div class="number" style="color: #a0c4ff;">${totalDone}</div>
        <small>Tugas yang berhasil dikerjakan</small>
      </div>
    </div>

    <div class="card" style="margin-top: 20px;">
      <h3>📜 Riwayat (Tugas yang di-Pop)</h3>
      <div style="margin-top: 15px;">
        ${history.length === 0 
          ? `<div class="empty">Belum ada riwayat penghapusan ✨</div>` 
          : history.reverse().map(h => `
            <div style="padding: 10px; border-bottom: 1px solid #eee; display: flex; justify-content: space-between;">
              <span>${h.text}</span>
              <small style="color: #999;">${h.done ? '✅ Selesai' : '❌ Belum Selesai'}</small>
            </div>
          `).join('')}
      </div>
    </div>
  `;
}

// Modifikasi fungsi removeTodo agar menyimpan data ke history sebelum dihapus
function removeTodo() {
  if (todos.length === 0) return alert("Stack kosong!");
  
  const removed = todos.pop(); // Mengambil data teratas
  history.push(removed); // Masukkan ke riwayat penggunaan
  
  alert("Pop Berhasil! Menghapus: " + removed.text);
  save();
  showTasks();
}

function filterTasks() {
  const keyword = document.getElementById("searchTask").value.toLowerCase();
  const taskElements = document.querySelectorAll(".task");

  taskElements.forEach(el => {
    const text = el.innerText.toLowerCase();
    el.style.display = text.includes(keyword) ? "block" : "none";
  });
}

function showPopup(title, desc) {
  document.getElementById("popupText").innerText = title;
  document.getElementById("popupDesc").innerText = desc;

  const modal = document.getElementById("popupModal");
  modal.classList.add("active");
}

function closePopup() {
  const modal = document.getElementById("popupModal");

  // safety reset
  modal.classList.remove("active");
}
document.addEventListener("click", function (e) {
  const modal = document.getElementById("popupModal");

  if (e.target === modal) {
    modal.classList.remove("active");
  }
});

// ================= VIEW: TAMBAH (DENGAN JAM) =================
function showAdd() {
  const title = document.getElementById("pageTitle");
  if (title) title.innerText = "Tambah Tugas";
  if (!content) return;

  content.innerHTML = `
    <div class="card add-modern">
      <h3>✨ Tambah Tugas & Waktu</h3>
      <div class="form-group" style="margin-top: 20px;">
        <label>Judul Tugas</label>
        <input id="todoInput" placeholder="Contoh: Kumpul Laporan..." style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 10px;" />
      </div>

      <div class="form-group" style="margin-top: 15px;">
        <label>Waktu & Tanggal Deadline</label>
        <input type="datetime-local" id="deadlineInput" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 10px;" />
      </div>

      <button class="nav-btn" onclick="addTodo()" style="width: 100%; background: #bdb2ff; color: white; border: none; padding: 15px; border-radius: 10px; margin-top: 20px; cursor: pointer; font-weight: bold;">
        ➕ Tambahkan ke Stack
      </button>
    </div>
  `;
}

// ================= CORE ACTIONS (SIMPAN JAM) =================
function addTodo() {
  const input = document.getElementById("todoInput");
  const dateInput = document.getElementById("deadlineInput");

  if (!input || !input.value.trim()) return;

  const deadlineValue = dateInput.value || "Tanpa Deadline";

  todos.push({
    text: input.value.trim(),
    deadline: deadlineValue, // Menyimpan format: YYYY-MM-DDTHH:mm
    done: false,
    notified: false // Flag agar alarm tidak bunyi terus-menerus
  });

  input.value = "";
  save();
  showTasks();
}

// ================= FITUR ALARM / NOTIFIKASI =================
function checkDeadlines() {
  const now = new Date();
  
  todos.forEach((t, index) => {
    if (t.deadline !== "Tanpa Deadline" && !t.done && !t.notified) {
      const taskTime = new Date(t.deadline);
      
      // Jika waktu sekarang sudah melewati atau sama dengan waktu tugas
      if (now >= taskTime) {
        // 1. Munculkan Notifikasi Browser
        if (Notification.permission === "granted") {
          new Notification("⏰ Pengingat Tugas!", {
            body: `Waktunya mengerjakan: ${t.text}`,
            icon: "icon/calendar.png"
          });
        }
        
        // 2. Munculkan Alert sebagai Alarm
        alert("🚨 ALARM DEADLINE!\nTugas: " + t.text + "\nSegera selesaikan!");
        
        // Tandai sudah dinotifikasi agar tidak muncul berulang kali
        todos[index].notified = true;
        save();
      }
    }
  });
}

// Minta izin notifikasi saat halaman dimuat
if (Notification.permission !== "denied") {
  Notification.requestPermission();
}

// Jalankan pengecekan setiap 30 detik
setInterval(checkDeadlines, 30000);