// ambil elemen
const content = document.querySelector(".content");

// data tugas
let todos = JSON.parse(localStorage.getItem("todos")) || [];

// render semua
function render() {
  content.innerHTML = `
    <div class="card big">
      <h3>Selamat Datang ✨</h3>
      <p>Mulai atur tugasmu hari ini dengan lebih rapi dan produktif.</p>
    </div>

    <div class="grid">
      <div class="card">
        <h4>Total Tugas</h4>
        <div class="number">${todos.length}</div>
      </div>
      <div class="card">
        <h4>Selesai</h4>
        <div class="number">${todos.filter(t => t.done).length}</div>
      </div>
      <div class="card">
        <h4>Belum</h4>
        <div class="number">${todos.filter(t => !t.done).length}</div>
      </div>
    </div>

    <div class="card">
      <h3>Tambah Tugas</h3>
      <input id="todoInput" placeholder="Tulis tugas..." />
      <button onclick="addTodo()">Tambah</button>
    </div>

    <div class="card">
      <h3>Daftar Tugas</h3>
      <div id="list">
        ${
          todos.length === 0
            ? `<div class="empty">Belum ada tugas</div>`
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
    </div>
  `;
}

// tambah tugas
function addTodo() {
  const input = document.getElementById("todoInput");
  if (input.value.trim() === "") return;

  todos.push({
    text: input.value,
    done: false
  });

  input.value = "";
  save();
}

// toggle selesai
function toggle(index) {
  todos[index].done = !todos[index].done;
  save();
}

// hapus tugas
function removeTodo(index) {
  todos.splice(index, 1);
  save();
}

// simpan ke localStorage
function save() {
  localStorage.setItem("todos", JSON.stringify(todos));
  render();
}

// pertama kali load
render();