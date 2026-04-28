// Inisialisasi Stack Tugas
let tasks = [];

// FUNGSI LOGIN (Simulasi Backend Auth)
function login() {
  const id = document.getElementById("userId").value;
  if (id) {
    // Menyembunyikan login, menampilkan app (Logika UI ditangani CSS Adema)
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    showTasks();
  } else {
    alert("Masukkan User ID terlebih dahulu!");
  }
}

function logout() {
  location.reload();
}

// LOGIKA TAMBAH TUGAS (Push ke Stack)
function addTask() {
  const taskInput = document.getElementById("taskInput");
  const taskName = taskInput.value.trim();

  if (taskName !== "") {
    // Prinsip LIFO: Menambahkan data ke tumpukan paling atas
    tasks.push(taskName);
    
    // Reset input dan kembali ke daftar tugas
    taskInput.value = "";
    showTasks();
    alert("Tugas berhasil ditambahkan ke tumpukan!");
  } else {
    alert("Nama tugas tidak boleh kosong!");
  }
}

// LOGIKA TAMPILKAN TUGAS (Iterasi LIFO)
function showTasks() {
  let html = `<div class="header">Daftar Tugas (Terbaru di Atas)</div>`;

  if (tasks.length === 0) {
    html += `<div class="empty">Belum ada tugas di tumpukan 😴</div>`;
  } else {
    // Reverse digunakan agar user melihat tumpukan terbaru paling atas (LIFO)
    tasks.slice().reverse().forEach((t, i) => {
      // Index asli dihitung mundur karena kita menggunakan reverse
      const originalIndex = tasks.length - 1 - i;
      html += `
        <div class="task">
          <span>${t}</span>
          <button onclick="deleteTask(${originalIndex})">Selesai</button>
        </div>
      `;
    });
  }

  document.getElementById("content").innerHTML = html;
}

// LOGIKA HAPUS BERDASARKAN INDEX
function deleteTask(index) {
  tasks.splice(index, 1);
  showTasks();
}

// FUNGSI UTAMA LIFO: HAPUS TERAKHIR (Pop dari Stack)
function deleteLast() {
  if (tasks.length > 0) {
    const removedTask = tasks.pop(); // Menghapus elemen paling atas
    alert(`Tugas "${removedTask}" telah diselesaikan!`);
    showTasks();
  } else {
    alert("Tumpukan sudah kosong!");
  }
}

// NAVIGASI UI (Backend Trigger untuk UI)
function showAdd() {
  document.getElementById("content").innerHTML = `
    <div class="add-box">
      <h2>Tambah Tugas Baru</h2>
      <input id="taskInput" placeholder="Contoh: Kerjakan Laporan PSD...">
      <button onclick="addTask()">Tambahkan ke Stack</button>
    </div>
  `;
}