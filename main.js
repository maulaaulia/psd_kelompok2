let tasks = [];

function login() {
  const id = document.getElementById("userId").value;
  if (id) {
    document.getElementById("loginPage").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
    showTasks();
  }
}

function logout() {
  location.reload();
}

function showAdd() {
  document.getElementById("content").innerHTML = `
    <div class="add-box">
      <h2>Tambah Tugas</h2>
      <input id="taskInput" placeholder="Nama tugas...">
      <button onclick="addTask()">Simpan</button>
    </div>
  `;
}

function addTask() {
  const task = document.getElementById("taskInput").value;

  if (task) {
    tasks.push(task);
    showTasks();
  }
}

function showTasks() {
  let html = `<div class="header">Daftar Tugas</div>`;

  if (tasks.length === 0) {
    html += `<div class="empty">Belum ada tugas 😴</div>`;
  } else {
    tasks.slice().reverse().forEach((t, i) => {
      html += `
        <div class="task">
          <span>${t}</span>
          <button onclick="deleteTask(${tasks.length - 1 - i})">Hapus</button>
        </div>
      `;
    });
  }

  document.getElementById("content").innerHTML = html;
}

function deleteTask(index) {
  tasks.splice(index, 1);
  showTasks();
}

function deleteLast() {
  tasks.pop();
  showTasks();
}