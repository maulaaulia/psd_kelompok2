const content = document.querySelector(".content");

let todos = JSON.parse(localStorage.getItem("todos")) || [];

// ================= DASHBOARD =================
function showDashboard() {
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

// ================= LIST TUGAS =================
function showTasks() {
  content.innerHTML = `
    <div class="card">
      <h3>Daftar Tugas</h3>
      ${
        todos.length === 0
          ? `<div class="empty">Belum ada tugas 🥱</div>`
          : todos.map((t, i) => `
            <div style="display:flex; justify-content:space-between; margin:10px 0;">
              <span style="text-decoration:${t.done ? 'line-through' : 'none'}">
                ${t.text}
              </span>
              <div>
                <button onclick="toggle(${i})">✔</button>
                <button onclick="removeTodo(${i})">❌</button>
              </div>
            </div>
          `).join("")
      }
    </div>
  `;
}

// ================= TAMBAH =================
function showAdd() {
  content.innerHTML = `
    <div class="card">
      <h3>Tambah Tugas</h3>
      <input id="todoInput" placeholder="Tulis tugas..." />
      <button onclick="addTodo()">Tambah</button>
    </div>
  `;
}

// ================= LOGIC =================
function addTodo() {
  const input = document.getElementById("todoInput");
  if (!input.value.trim()) return;

  todos.push({
    text: input.value,
    done: false
  });

  input.value = "";
  save();
  showTasks(); // langsung pindah ke list
}

function toggle(i) {
  todos[i].done = !todos[i].done;
  save();
  showTasks();
}

function removeTodo() {
  todos.pop();
  save();
  showTasks();
}

function save() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

// default pertama
showDashboard();

function setActive(btn) {
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
}
